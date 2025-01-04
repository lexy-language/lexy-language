import {VariableType} from "./variableType";

export class VoidType extends VariableType {

  public readonly variableTypeName: "VoidType";

  equals(other: VariableType | null): boolean {
    return this.variableTypeName == other?.variableTypeName;
  }
}
