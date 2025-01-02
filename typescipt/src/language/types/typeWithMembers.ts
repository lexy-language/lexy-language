import {VariableType} from "./variableType";
import {ITypeWithMembers} from "./iTypeWithMembers";
import {IValidationContext} from "../../parser/validationContext";

export abstract class TypeWithMembers extends VariableType implements ITypeWithMembers {
   public typeWithMember: true;
   public abstract memberType(name: string, context: IValidationContext): VariableType;
}
