import {VariableType} from "../../types/variableType";
import {VariableSource} from "../../variableSource";

export class Mapping {
   public variableName: string
   public variableType: VariableType
   public variableSource: VariableSource

   constructor(variableName: string, variableType: VariableType, variableSource: VariableSource) {
     this.variableName = variableName;
     this.variableType = variableType;
     this.variableSource = variableSource;
   }
}
