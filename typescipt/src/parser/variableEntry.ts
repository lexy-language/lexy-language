import {VariableSource} from "../language/variableSource"
import {VariableType} from "../language/types/variableType"

export class VariableEntry {
  public variableType: VariableType;
  public variableSource: VariableSource;

  constructor(variableType: VariableType, variableSource: VariableSource) {
    this.variableType = variableType;
    this.variableSource = variableSource;
   }
}
