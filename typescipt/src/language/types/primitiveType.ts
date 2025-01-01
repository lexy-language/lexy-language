import {TypeNames} from "./TypeNames";
import {VariableType} from "./variableType";

export class PrimitiveType extends VariableType
{
  public static readonly boolean: PrimitiveType = new PrimitiveType(TypeNames.boolean);
  public static readonly string: PrimitiveType = new PrimitiveType(TypeNames.string);
  public static readonly number: PrimitiveType = new PrimitiveType(TypeNames.number);
  public static readonly date: PrimitiveType = new PrimitiveType(TypeNames.date);

  public type: string;

  private constructor(type: string) {
    super();
    this.type = type;
  }

  public equals(other: PrimitiveType): boolean
  {
    return this.type == other.type;
  }

  public toString()
  {
    return this.type;
  }
}