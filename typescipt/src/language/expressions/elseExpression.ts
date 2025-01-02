import {Expression} from "./Expression";
import {asParsableNode, IParsableNode} from "../parsableNode";
import {IDependantExpression} from "./IDependantExpression";
import {ExpressionList} from "./expressionList";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {IfExpression} from "./ifExpression";
import {INode} from "../node";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {TokenList} from "../../parser/tokens/tokenList";
import {Keywords} from "../../parser/Keywords";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "../types/variableType";

export class ElseExpression extends Expression implements IParsableNode, IDependantExpression {
  private readonly falseExpressionsValue: ExpressionList;

  public isParsableNode: true;
  public isDependantExpression: true;
  public nodeType: "ElseExpression";

  public get falseExpressions() {
    return this.falseExpressionsValue;
  }

  constructor(source: ExpressionSource, reference: SourceReference) {
    super(source, reference);
    this.falseExpressionsValue = new ExpressionList(reference);
  }

  public linkPreviousExpression(expression: Expression, context: IParseLineContext): void {

    if (expression.nodeType != "IfExpression") {
      context.logger.fail(this.reference, `Else should be following an If statement. No if statement found.`);
      return;
    }

    const ifExpression = expression as IfExpression;
    ifExpression.linkElse(this);
  }

  public override getChildren(): Array<INode> {
    return this.falseExpressionsValue.asArray();
  }

  public parse(context: IParseLineContext): IParsableNode {
    let expression = this.falseExpressionsValue.parse(context);
    if (expression.state != "success") return this;
    const node = asParsableNode(expression.result);
    return node != null ? node : this;
  }

  public static parse(source: ExpressionSource): ParseExpressionResult {
    let tokens = source.tokens;
    if (!this.isValid(tokens)) return newParseExpressionFailed(ElseExpression, `Not valid.`);

    if (tokens.length > 1) return newParseExpressionFailed(ElseExpression, `No tokens expected.`);

    let reference = source.createReference();

    let expression = new ElseExpression(source, reference);

    return newParseExpressionSuccess(expression);
  }

  public static isValid(tokens: TokenList): boolean {
    return tokens.isKeyword(0, Keywords.Else);
  }

  protected override validate(context: IValidationContext): void {
  }

  public override deriveType(context: IValidationContext): VariableType | null {
    return null;
  }
}
