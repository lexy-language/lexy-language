import {ComplexTypeReference} from "./complexTypeReference";
import {ComplexType} from "./complexType";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "./variableType";

export class TableRowType extends ComplexTypeReference {

   public tableName: string ;
   public complexType: ComplexType;

   constructor(tableName: string, complexType: ComplexType) {
     super(tableName);
     this.tableName = tableName;
     this.complexType = complexType;
   }

   public override getComplexType(context: IValidationContext): ComplexType {
     return ComplexType;
   }

   public override memberType(name: string, context: IValidationContext): VariableType | null {
     return this.complexType.memberType(name, context);
   }
}
