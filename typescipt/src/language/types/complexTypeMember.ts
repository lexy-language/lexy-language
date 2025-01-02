import {VariableType} from "./variableType";

export class ComplexTypeMember {
   public name: string
   public type: VariableType

   constructor(name: string, type: VariableType) {
     this.name = name;
     this.type = type;
   }
}
