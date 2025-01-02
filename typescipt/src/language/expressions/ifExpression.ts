import {Expression} from "./Expression";
import {asParsableNode, IParsableNode} from "../parsableNode";
import {ExpressionList} from "./expressionList";
import {ElseExpression} from "./elseExpression";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {INode} from "../node";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {ExpressionFactory} from "./expressionFactory";
import {TokenList} from "../../parser/tokens/tokenList";
import {Keywords} from "../../parser/Keywords";
import {IValidationContext} from "../../parser/validationContext";
import {PrimitiveType} from "../types/primitiveType";
import {VariableType} from "../types/variableType";

export class IfExpression extends Expression implements IParsableNode {

  private readonly trueExpressionsValues: ExpressionList;

  public isParsableNode: true;
  public nodeType: "IfExpression";

  public condition: Expression

  public get trueExpressions(): Array<Expression> {
    return this.trueExpressionsValues.asArray();
  }

  public else: ElseExpression

  constructor(condition: Expression, source: ExpressionSource, reference: SourceReference) {
    super(source, reference);
    this.condition = condition;
    this.trueExpressionsValues = new ExpressionList(reference);
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

  public static parse(source: ExpressionSource): ParseExpressionResult {
    let tokens = source.tokens;
    if (!this.isValid(tokens)) return newParseExpressionFailed(IfExpression, `Not valid.`);

    if (tokens.length == 1) return newParseExpressionFailed(IfExpression, `No condition found`);

    let condition = tokens.tokensFrom(1);
    let conditionExpression = ExpressionFactory.parse(condition, source.line);
    if (conditionExpression.state != 'success') return conditionExpression;

    let reference = source.createReference();

    let expression = new IfExpression(conditionExpression.result, source, reference);

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
    if (this.else != null) throw new Error(`'else' already linked.`);

    this.else = elseExpression;
  }

  public override deriveType(context: IValidationContext): VariableType | null {
    return null;
  }
}
