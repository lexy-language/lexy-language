import {VariableType} from "./variableType";

import type {IValidationContext} from "../../parser/ValidationContext";

export function instanceOfTypeWithMembers(object: any): object is ITypeWithMembers {
   return object?.typeWithMember == true;
}

export function asTypeWithMembers(object: any): ITypeWithMembers | null {
   return instanceOfTypeWithMembers(object) ? object as ITypeWithMembers : null;
}

export interface ITypeWithMembers {
   typeWithMember: true;
   memberType(name: string , context: IValidationContext): VariableType | null;
}
