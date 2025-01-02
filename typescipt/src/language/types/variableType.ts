export abstract class VariableType {
  public abstract readonly variableTypeName: string;
  public abstract equals(other: VariableType | null): boolean;
}
