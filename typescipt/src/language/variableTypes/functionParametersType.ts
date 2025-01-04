import {ComplexTypeReference} from "./complexTypeReference";
import {ComplexType} from "./complexType";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "./variableType";

export class FunctionParametersType extends ComplexTypeReference {

  public readonly variableTypeName = "FunctionParametersType";
  public functionName: string
   public complexType: ComplexType

   constructor(functionName: string, complexType: ComplexType) {
     super(functionName);
     this.functionName = functionName;
     this.complexType = complexType;
   }

   public override getComplexType(context: IValidationContext): ComplexType {
     return this.complexType;
   }

   public override memberType(name: string, context: IValidationContext): VariableType | null {
     return this.complexType.memberType(name, context);
   }

  equals(other: VariableType | null): boolean {
    if (other == null || other.variableTypeName != this.variableTypeName) return false;
    const functionParametersType = other as FunctionParametersType;
    return this.functionName == functionParametersType.functionName;
  }
}
