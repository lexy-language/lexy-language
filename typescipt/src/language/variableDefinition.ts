import type {INode} from "./node";
import type {IHasNodeDependencies} from "./IHasNodeDependencies";
import type {IValidationContext} from "../parser/validationContext";
import type {IParseLineContext} from "../parser/ParseLineContext";
import type {IRootNode} from "./rootNode";

import {VariableType} from "./variableTypes/variableType";
import {VariableDeclarationType} from "./variableTypes/variableDeclarationType";
import {SourceReference} from "../parser/sourceReference";
import {Expression} from "./expressions/expression";
import {VariableSource} from "./variableSource";
import {Node} from "./node";
import {RootNodeList} from "./rootNodeList";
import {OperatorType} from "../parser/tokens/operatorType";
import {asOperatorToken, OperatorToken} from "../parser/tokens/operatorToken";
import {validateTypeAndDefault} from "./variableTypes/validationContextExtensions";
import {VariableDeclarationTypeParser} from "./variableTypes/variableDeclarationTypeParser";
import {NodeType} from "./nodeType";

export class VariableDefinition extends Node implements IHasNodeDependencies {

  private variableTypeValue: VariableType | null;

  public readonly hasNodeDependencies = true;
  public readonly nodeType = NodeType.VariableDefinition;
  public readonly defaultExpression: Expression | null;
  public readonly source: VariableSource;
  public readonly type: VariableDeclarationType;
  public readonly name: string;

  public get variableType(): VariableType | null {
     return this.variableTypeValue;
   }

   constructor(name: string, type: VariableDeclarationType,
     source: VariableSource, reference: SourceReference, defaultExpression: Expression | null = null) {
     super(reference);
     this.type = type;
     this.name = name;
     this.defaultExpression = defaultExpression;
     this.source = source;
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     const dependencies = this.variableType?.getDependencies(rootNodeList);
     return !!dependencies ? dependencies : [];
   }

   public static parse(source: VariableSource, context: IParseLineContext): VariableDefinition | null {
     let line = context.line;
     let result = context.validateTokens("VariableDefinition")
       .countMinimum(2)
       .stringLiteral(0)
       .stringLiteral(1)
       .isValid;

     if (!result) return null;

     let tokens = line.tokens;
     let name = tokens.tokenValue(1);
     let type = tokens.tokenValue(0);
     if (name == null || type == null) return null;

     let variableType = VariableDeclarationTypeParser.parse(type, line.tokenReference(0));
     if (variableType == null) return null;

     if (tokens.length == 2) return new VariableDefinition(name, variableType, source, line.lineStartReference());

     if (tokens.token<OperatorToken>(2, asOperatorToken)?.type != OperatorType.Assignment) {
       context.logger.fail(line.tokenReference(2), `Invalid variable declaration token. Expected '='.`);
       return null;
     }

     if (tokens.length != 4) {
       context.logger.fail(line.lineEndReference(),
         `Invalid variable declaration. Expected literal token.`);
       return null;
     }

     const defaultValue = context.expressionFactory.parse(tokens.tokensFrom(3), line);
     if (defaultValue.state == "failed") {
       context.logger.fail(line.tokenReference(3), defaultValue.errorMessage);
       return null;
     }

     return new VariableDefinition(name, variableType, source, line.lineStartReference(), defaultValue.result);
   }

   public override getChildren(): Array<INode> {
    return this.defaultExpression != null ? [this.defaultExpression, this.type] : [this.type];
   }

   protected override validate(context: IValidationContext): void {
     this.variableTypeValue = this.type.createVariableType(context);

     context.variableContext.registerVariableAndVerifyUnique(this.reference, this.name, this.variableTypeValue, this.source);

     validateTypeAndDefault(context, this.reference, this.type, this.defaultExpression);
   }
}
