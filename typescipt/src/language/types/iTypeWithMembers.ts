import {IValidationContext} from "../../parser/ValidationContext";
import {VariableType} from "./variableType";
import {nameOf} from "../../infrastructure/nameOf";

export function instanceOfTypeWithMembers(object: any): object is ITypeWithMembers {
   return nameOf<ITypeWithMembers>("typeWithMember") in object;
}

export function asTypeWithMembers(object: any): ITypeWithMembers | null {
   return instanceOfTypeWithMembers(object) ? object as ITypeWithMembers : null;
}

export interface ITypeWithMembers {
   typeWithMember: true;
   memberType(name: string , context: IValidationContext): VariableType | null;
}
