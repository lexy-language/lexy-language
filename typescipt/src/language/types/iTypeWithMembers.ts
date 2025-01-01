import {IValidationContext} from "../../parser/ValidationContext";
import {VariableType} from "./variableType";

export interface ITypeWithMembers {
   isWithMembers: true;
   memberType(name: string , context: IValidationContext): VariableType;
}
