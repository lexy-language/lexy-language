import type {IParseLineContext} from "../../parser/ParseLineContext";
import type {INode} from "../node";
import type {IExpressionFactory} from "./expressionFactory";
import type {IValidationContext} from "../../parser/validationContext";
import type {IChildExpression, IParentExpression} from "./IChildExpression";

import {Expression} from "./Expression";
import {asParsableNode, IParsableNode} from "../parsableNode";
import {ExpressionList} from "./expressionList";
import {asElseExpression, ElseExpression} from "./elseExpression";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {TokenList} from "../../parser/tokens/tokenList";
import {Keywords} from "../../parser/Keywords";
import {PrimitiveType} from "../variableTypes/primitiveType";
import {VariableType} from "../variableTypes/variableType";

export class IfExpression extends Expression implements IParsableNode, IParentExpression {

  private readonly trueExpressionsValues: ExpressionList;

  public isParentExpression: true;
  public isParsableNode: true;
  public nodeType = "IfExpression";

  public condition: Expression

  public get trueExpressions(): Array<Expression> {
    return this.trueExpressionsValues.asArray();
  }

  public else: ElseExpression | null;

  constructor(condition: Expression, source: ExpressionSource, reference: SourceReference, factory: IExpressionFactory) {
    super(source, reference);
    this.condition = condition;
    this.trueExpressionsValues = new ExpressionList(reference, factory);
  }

  public parse(context: IParseLineContext): IParsableNode {
    let expression = this.trueExpressionsValues.parse(context);
    if (expression.state != "success") return this;
    const parsableNode = asParsableNode(expression.result);
    return parsableNode != null ? parsableNode : this;
  }

  public override getChildren(): Array<INode> {
    const result: Array<INode> = [this.condition, ...this.trueExpressionsValues.asArray()];
    if (this.else != null) result.push(this.else);
    return result;
  }

  public static parse(source: ExpressionSource, factory: IExpressionFactory): ParseExpressionResult {
    let tokens = source.tokens;
    if (!IfExpression.isValid(tokens)) return newParseExpressionFailed("IfExpression", `Not valid.`);

    if (tokens.length == 1) return newParseExpressionFailed("IfExpression", `No condition found`);

    let condition = tokens.tokensFrom(1);
    let conditionExpression = factory.parse(condition, source.line);
    if (conditionExpression.state != 'success') return conditionExpression;

    let reference = source.createReference();

    let expression = new IfExpression(conditionExpression.result, source, reference, factory);

    return newParseExpressionSuccess(expression);
  }

  public static isValid(tokens: TokenList): boolean {
    return tokens.isKeyword(0, Keywords.If);
  }

  protected override validate(context: IValidationContext): void {
    let type = this.condition.deriveType(context);
    if (type == null || !type.equals(PrimitiveType.boolean))
      context.logger.fail(this.reference, `'if' condition expression should be 'boolean', is of wrong type '${type}'.`);
  }

  public linkElse(elseExpression: ElseExpression): void {

  }

  public override deriveType(context: IValidationContext): VariableType | null {
    return null;
  }


  linkChildExpression(expression: IChildExpression): void {
    if (this.else != null) throw new Error(`'else' already linked.`);

    const elseExpression = asElseExpression(expression);
    if (elseExpression == null) throw new Error(`Invalid node type: ${expression.nodeType}`);

    this.else = elseExpression;
  }
}
