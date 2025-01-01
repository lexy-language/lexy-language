import {VariableSource} from "./VariableSource"
import {VariableType} from "../language/types/variableType"

export class VariableEntry {
  public variableType: VariableType | null;
  public variableSource: VariableSource;

  constructor(variableType: VariableType | null, variableSource: VariableSource) {
    this.variableType = variableType;
    this.variableSource = variableSource;
   }
}
