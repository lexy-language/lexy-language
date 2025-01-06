import {VariableType} from "./variableType";
import {VariableTypeName} from "./variableTypeName";

export class VoidType extends VariableType {

  public readonly variableTypeName = VariableTypeName.VoidType;

  equals(other: VariableType | null): boolean {
    return this.variableTypeName == other?.variableTypeName;
  }
}
