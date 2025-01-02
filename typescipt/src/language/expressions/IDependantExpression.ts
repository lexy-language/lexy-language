import {IParseLineContext} from "../../parser/ParseLineContext";
import {Expression} from "./expression";
import {nameOf} from "../../infrastructure/nameOf";

export function instanceOfDependantExpression(object: any): object is IDependantExpression {
   return nameOf<IDependantExpression>("isDependantExpression") in object;
}

export function asDependantExpression(object: any): IDependantExpression | null {
   return instanceOfDependantExpression(object) ? object as IDependantExpression : null;
}

export interface IDependantExpression {
   isDependantExpression: true;
   linkPreviousExpression(expression: Expression | null, context: IParseLineContext): void;
}
