

export class Mapping {
   public string VariableName
   public VariableType VariableType
   public VariableSource VariableSource

   constructor(variableName: string, variableType: VariableType, variableSource: VariableSource) {
     VariableName = variableName;
     VariableType = variableType;
     VariableSource = variableSource;
   }
}
