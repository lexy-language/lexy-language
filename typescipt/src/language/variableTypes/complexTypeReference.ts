import {VariableType} from "./variableType";
import {ITypeWithMembers} from "./ITypeWithMembers";
import {IValidationContext} from "../../parser/validationContext";
import {ComplexType} from "./complexType";

export function asComplexTypeReference(object: any): ComplexTypeReference | null {
   return object.isComplexTypeReference ? object as ComplexTypeReference : null;
}

export abstract class ComplexTypeReference extends VariableType implements ITypeWithMembers {

   public readonly typeWithMember: true;
   public readonly isComplexTypeReference: true;

   public name: string;

   protected constructor(name: string) {
     super();
     this.name = name;
   }

   public abstract memberType(name: string, context: IValidationContext): VariableType | null;

   public abstract getComplexType(context: IValidationContext): ComplexType | null;
}
