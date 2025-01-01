export abstract class VariableType {
  public variableTypeName: string;
  public abstract equals(other: VariableType | null): boolean;
}
