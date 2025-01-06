import type {INode} from "../node";
import type {IChildExpression, IParentExpression} from "./IChildExpression";
import type {IExpressionFactory} from "./expressionFactory";
import type {IValidationContext} from "../../parser/validationContext";
import type {IParseLineContext} from "../../parser/ParseLineContext";

import {Expression} from "./Expression";
import {asParsableNode, IParsableNode} from "../parsableNode";
import {ExpressionList} from "./expressionList";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {TokenList} from "../../parser/tokens/tokenList";
import {Keywords} from "../../parser/Keywords";
import {VariableType} from "../variableTypes/variableType";
import {NodeType} from "../nodeType";

export function instanceOfElseExpression(object: any): object is ElseExpression {
  return object?.nodeType == NodeType.ElseExpression;
}

export function asElseExpression(object: any): ElseExpression | null {
  return instanceOfElseExpression(object) ? object as ElseExpression : null;
}

export class ElseExpression extends Expression implements IParsableNode, IChildExpression {
  private readonly falseExpressionsValue: ExpressionList;

  public isParsableNode: true;
  public isChildExpression: true;
  public nodeType = NodeType.ElseExpression;

  public get falseExpressions(): ReadonlyArray<Expression> {
    return this.falseExpressionsValue.asArray();
  }

  constructor(source: ExpressionSource, reference: SourceReference, factory: IExpressionFactory) {
    super(source, reference);
    this.falseExpressionsValue = new ExpressionList(reference, factory);
  }

  public validateParentExpression(expression: IParentExpression | null, context: IParseLineContext): boolean {
    if (expression == null || expression.nodeType != "IfExpression") {
      context.logger.fail(this.reference, `Else should be following an If statement. No if statement found.`);
      return false;
    }
    return true;
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

  public static parse(source: ExpressionSource, factory: IExpressionFactory): ParseExpressionResult {
    let tokens = source.tokens;
    if (!ElseExpression.isValid(tokens)) return newParseExpressionFailed("ElseExpression", `Not valid.`);

    if (tokens.length > 1) return newParseExpressionFailed("ElseExpression", `No tokens expected.`);

    let reference = source.createReference();

    let expression = new ElseExpression(source, reference, factory);

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
