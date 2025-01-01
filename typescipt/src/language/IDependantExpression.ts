import {IParseLineContext} from "../parser/ParseLineContext";
import {Expression} from "./expressions/expression";

export interface IDependantExpression {
   linkPreviousExpression(expression: Expression, context: IParseLineContext): void;
}
