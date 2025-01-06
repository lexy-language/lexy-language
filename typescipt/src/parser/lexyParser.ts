import type {IParserContext} from "./parserContext";
import type {ITokenizer} from "./tokens/tokenizer";
import type {IParserLogger} from "./parserLogger";
import type {ISourceCodeDocument} from "./sourceCodeDocument";
import type {IParsableNode} from "../language/parsableNode";
import type {IExpressionFactory} from "../language/expressions/expressionFactory";
import type {IRootNode} from "../language/rootNode";

import {ParserResult} from "./parserResult";
import {ParsableNodeArray} from "../language/parsableNodeArray";
import {ParseLineContext} from "./ParseLineContext";
import {Include} from "../language/include";
import {ValidationContext} from "./validationContext";
import {DependencyGraphFactory} from "../dependencyGraph/dependencyGraphFactory";
import {IFileSystem} from "./IFileSystem";
import {SourceCodeDocument} from "./sourceCodeDocument";

export interface ILexyParser {
  parseFile(fileName: string, throwException: boolean): ParserResult;
  parse(code: string[], fileName: string, throwException: boolean): ParserResult;
}

export class LexyParser implements ILexyParser {
  private readonly tokenizer: ITokenizer;
  private readonly context: IParserContext;
  private readonly logger: IParserLogger;
  private readonly sourceCode: ISourceCodeDocument;
  private readonly fileSystem: IFileSystem;
  private readonly expressionFactory: IExpressionFactory;

   constructor(parserContext: IParserContext, logger: IParserLogger,
               tokenizer: ITokenizer, fileSystem: IFileSystem, expressionFactory: IExpressionFactory) {
     this.context = parserContext;
     this.logger = logger;
     this.tokenizer = tokenizer;
     this.fileSystem = fileSystem;
     this.expressionFactory = expressionFactory;
     this.sourceCode = new SourceCodeDocument();
   }

   public parseFile(fileName: string, throwException: boolean = true): ParserResult {
     this.logger.logInfo(`Parse file: ` + fileName);

     const code = this.fileSystem.readAllLines(fileName);
     return this.parse(code, fileName, throwException);
   }

   public parse(code: string[], fullFileName: string, throwException: boolean = true): ParserResult {
     this.context.addFileIncluded(fullFileName);

     this.parseDocument(code, fullFileName);
     this.validateNodesTree();
     this.logger.logNodes(this.context.nodes.asArray());

     this.validateNodesTree();
     this.detectCircularDependencies();

     if (throwException) this.logger.assertNoErrors();

     return new ParserResult(this.context.nodes, this.logger);
   }

   private parseDocument(code: string[], fullFileName: string): void {
     this.sourceCode.setCode(code, this.fileSystem.getFileName(fullFileName));

     let currentIndent = 0;
     let nodePerIndent = new ParsableNodeArray(this.context.rootNode);

     while (this.sourceCode.hasMoreLines()) {
       if (!this.processLine()) {
         currentIndent = this.sourceCode.currentLine?.indent(this.logger) ?? currentIndent;
         continue;
       }

       let line = this.sourceCode.currentLine;
       if (line.isEmpty()) continue;

       let indent = line.indent(this.logger);
       if (indent == null) continue;

       if (indent > currentIndent) {
         this.context.logger.fail(line.lineStartReference(), `Invalid indent: ${indent}`);
         continue;
       }

       let node = nodePerIndent.get(indent);
       node = this.parseLine(node);

       currentIndent = indent + 1;

       nodePerIndent.set(currentIndent, node);
     }

     this.reset();

     this.loadIncludedFiles(fullFileName);
   }

   private processLine(): boolean {
     let line = this.sourceCode.nextLine();
     this.logger.log(line.lineStartReference(), `'${line.content}'`);

     let tokens = line.tokenize(this.tokenizer);
     if (tokens.state != 'success') {
       this.logger.fail(tokens.reference, tokens.errorMessage);
       return false;
     }

     const tokenNames = this.sourceCode.currentLine.tokens.asArray()
       .map(token => `${token.tokenType}(${token.value})`)
       .join(" ");

     this.logger.log(line.lineStartReference(), ` Tokens: ` + tokenNames);

     return true;
   }

   private loadIncludedFiles(parentFullFileName: string): void {
     let includes = this.context.rootNode.getDueIncludes();
     for (const include of includes) {
       this.includeFiles(parentFullFileName, include)
     }
   }

   private includeFiles(parentFullFileName: string, include: Include): void {
     let fileName = include.process(parentFullFileName, this.context);
     if (fileName == null) return;

     if (this.context.isFileIncluded(fileName)) return;

     this.logger.logInfo(`Parse file: ` + fileName);

     const code = this.fileSystem.readAllLines(fileName);

     this.context.addFileIncluded(fileName);

     this.parseDocument(code, fileName);
   }

   private validateNodesTree(): void {
     let validationContext = new ValidationContext(this.logger, this.context.nodes);
     this.context.rootNode.validateTree(validationContext);
   }

   private detectCircularDependencies(): void {
     let dependencies = DependencyGraphFactory.create(this.context.nodes);
     if (!dependencies.hasCircularReferences) return;

     for (const circularReference of dependencies.circularReferences) {
       this.context.logger.setCurrentNode(circularReference);
       this.context.logger.fail(circularReference.reference,
         `Circular reference detected in: '${circularReference.nodeName}'`);
     }
   }

   private reset(): void {
     this.sourceCode.reset();
     this.logger.resetCurrentNode();
   }

   private parseLine(currentNode: IParsableNode | null): IParsableNode {
     let parseLineContext = new ParseLineContext(this.sourceCode.currentLine, this.context.logger, this.expressionFactory);
     let node = currentNode != null ? currentNode?.parse(parseLineContext) : null;
     if (node == null) {
       throw new Error(`(${currentNode}) Parse should return child node or itself.`);
     }

     const rootNode = this.asRootNode(node)
     if (rootNode != null) {
       this.context.logger.setCurrentNode(rootNode);
     }

     return node;
  }
  private instanceOfRootNode(object: any): object is IRootNode {
    return object?.isRootNode == true;
  }

  private asRootNode(object: any): IRootNode | null {
    return this.instanceOfRootNode(object) ? object as IRootNode : null;
  }
}
