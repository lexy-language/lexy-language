import type {IParseLineContext} from "../../parser/ParseLineContext";
import type {INode} from "../node";

export function instanceOfChildExpression(object: any): object is IChildExpression {
   return object?.isChildExpression == true;
}

export function asChildExpression(object: any): IChildExpression | null {
   return instanceOfChildExpression(object) ? object as IChildExpression : null;
}

export interface IChildExpression extends INode {
   isChildExpression: true;
   validateParentExpression(expression: IParentExpression | null, context: IParseLineContext): boolean;
}

export function instanceOfParentExpression(object: any): object is IParentExpression {
   return object?.isParentExpression == true;
}

export function asParentExpression(object: any): IParentExpression | null {
   return instanceOfParentExpression(object) ? object as IParentExpression : null;
}

export interface IParentExpression extends INode {
   isParentExpression: true;
   linkChildExpression(expression: IChildExpression): void;
}
