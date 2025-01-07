import type {IParseLineContext} from "../../parser/ParseLineContext";
import type {INode} from "../node";
import type {IExpressionFactory} from "./expressionFactory";
import type {IValidationContext} from "../../parser/validationContext";

import {Expression} from "./Expression";
import {VariableType} from "../variableTypes/variableType";
import {asParsableNode, IParsableNode} from "../parsableNode";
import {ExpressionList} from "./expressionList";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {Keywords} from "../../parser/Keywords";
import {TokenList} from "../../parser/tokens/tokenList";
import {NodeType} from "../nodeType";

export function instanceOfCaseExpression(object: any): object is CaseExpression {
  return object?.nodeType == NodeType.CaseExpression;
}

export function asCaseExpression(object: any): CaseExpression | null {
  return instanceOfCaseExpression(object) ? object as CaseExpression : null;
}

export class CaseExpression extends Expression implements IParsableNode {

  private readonly expressionsValues: ExpressionList;

  public readonly isParsableNode = true;
  public readonly isChildExpression = true;

  public readonly isDefault: boolean;
  public readonly nodeType = NodeType.CaseExpression;
  public readonly value: Expression | null;

   public get expressions(): Array<Expression>  {
    return this.expressionsValues.asArray();
   }

  constructor(value: Expression | null, isDefault: boolean, source: ExpressionSource, reference: SourceReference,
              factory: IExpressionFactory) {
    super(source, reference);
     this.value = value;
     this.isDefault = isDefault;
     this.expressionsValues = new ExpressionList(reference, factory);
   }

   public parse(context: IParseLineContext): IParsableNode {
     const expression = this.expressionsValues.parse(context);
     if (expression.state != "success") return this;
     const node = asParsableNode(expression.result)
     return node != null ? node : this;
   }

   public override getChildren(): Array<INode> {
    return this.value != null ? [this.value, ...this.expressions] : [...this.expressions];
   }

   public static parse(source: ExpressionSource, factory: IExpressionFactory): ParseExpressionResult {
     let tokens = source.tokens;
     if (!CaseExpression.isValid(tokens)) return newParseExpressionFailed("CaseExpression", `Not valid.`);

     if (tokens.isKeyword(0, Keywords.Default)) return CaseExpression.parseDefaultCase(source, tokens, factory);

     if (tokens.length == 1)
       return newParseExpressionFailed("CaseExpression", `Invalid 'case'. No parameters found.`);

     let value = tokens.tokensFrom(1);
     let valueExpression = factory.parse(value, source.line);
     if (valueExpression.state != 'success') return valueExpression;

     let reference = source.createReference();

     let expression = new CaseExpression(valueExpression.result, false, source, reference, factory);

     return newParseExpressionSuccess(expression);
   }

   private static parseDefaultCase(source: ExpressionSource, tokens: TokenList, factory: IExpressionFactory): ParseExpressionResult {
     if (tokens.length != 1)
       return newParseExpressionFailed("CaseExpression", `Invalid 'default' case. No parameters expected.`);

     let reference = source.createReference();
     let expression = new CaseExpression(null, true, source, reference, factory);
     return newParseExpressionSuccess(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.isKeyword(0, Keywords.Case)
        || tokens.isKeyword(0, Keywords.Default);
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType | null {
     return this.value != null ? this.value.deriveType(context) : null;
   }
}
