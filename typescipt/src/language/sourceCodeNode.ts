import type {IRootNode} from "./rootNode";
import type {IParseLineContext} from "../parser/ParseLineContext";
import type {IParsableNode} from "./parsableNode";
import type {INode} from "./node";
import type {IValidationContext} from "../parser/validationContext";
import type {IExpressionFactory} from "./expressions/expressionFactory";

import {Function} from "./functions/function";
import {RootNode} from "./rootNode";
import {Comments} from "./Comments";
import {Include} from "./include";
import {RootNodeList} from "./rootNodeList";
import {SourceReference} from "../parser/sourceReference";
import {SourceFile} from "../parser/sourceFile";
import {NodeName} from "../parser/nodeName";
import {Keywords} from "../parser/Keywords";
import {EnumDefinition} from "./enums/enumDefinition";
import {Scenario} from "./scenarios/scenario";
import {Table} from "./tables/table";
import {TypeDefinition} from "./types/typeDefinition";
import {DuplicateChecker} from "./duplicateChecker";
import {where} from "../infrastructure/enumerableExtensions";
import {NodeType} from "./nodeType";

export class SourceCodeNode extends RootNode {

  private readonly includes: Array<Include> = [];
  private expressionFactory: IExpressionFactory;

  public readonly nodeType = NodeType.SourceCodeNode;
  public readonly nodeName = "SourceCodeNode";

  public readonly comments: Comments;
  public readonly rootNodes: RootNodeList = new RootNodeList();

  constructor(expressionFactory: IExpressionFactory) {
    super(new SourceReference(new SourceFile(`SourceCodeNode`), 1, 1));
    this.comments = new Comments(this.reference);
    this.expressionFactory = expressionFactory;
  }

  public override parse(context: IParseLineContext): IParsableNode {
    let line = context.line;

    if (line.tokens.isComment()) return Comments;

    let rootNode = this.parseRootNode(context);
    if (rootNode == null) return this;

    this.rootNodes.add(rootNode);

    return rootNode;
  }

  private parseRootNode(context: IParseLineContext): IRootNode | null {
    if (Include.isValid(context.line)) {
      let include = Include.parse(context);
      if (include != null) {
        this.includes.push(include);
        return null;
      }
    }

    let tokenName = NodeName.parse(context);
    if (tokenName == null || tokenName.name == null) return null;

    let reference = context.line.lineStartReference();

    switch (tokenName.keyword) {
      case null:
        return null;
      case Keywords.FunctionKeyword:
        return Function.create(tokenName.name, reference, this.expressionFactory);
      case Keywords.EnumKeyword:
        return EnumDefinition.parse(tokenName.name, reference);
      case Keywords.ScenarioKeyword:
        return Scenario.parse(tokenName.name, reference);
      case Keywords.TableKeyword:
        return Table.parse(tokenName.name, reference);
      case Keywords.TypeKeyword:
        return TypeDefinition.parse(tokenName.name, reference);
      default:
        return this.invalidNode(tokenName, context, reference)
    }
  }

  private invalidNode(tokenName: NodeName, context: IParseLineContext, reference: SourceReference): IRootNode | null {
    context.logger.fail(reference, `Unknown keyword: ${tokenName.keyword}`);
    return null;
  }

  public override getChildren(): Array<INode> {
    return this.rootNodes.asArray();
  }

  protected override validate(context: IValidationContext): void {
    DuplicateChecker.validate(
      context,
      node => node.reference,
      node => node.nodeName,
      node => `Duplicated node name: '${node.nodeName}'`,
      this.rootNodes.asArray());
  }

  public getDueIncludes(): ReadonlyArray<Include> {
    return where(this.includes, include => !include.isProcessed);
  }
}
