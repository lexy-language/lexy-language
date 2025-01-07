import {TypeNames} from "./TypeNames";
import {VariableType} from "./variableType";
import {VariableTypeName} from "./variableTypeName";

export function instanceOfPrimitiveType(object: any): object is PrimitiveType {
  return object?.variableTypeName == VariableTypeName.PrimitiveType;
}

export function asPrimitiveType(object: any): PrimitiveType | null {
  return instanceOfPrimitiveType(object) ? object as PrimitiveType : null;
}

export class PrimitiveType extends VariableType
{
  public static readonly boolean: PrimitiveType = new PrimitiveType(TypeNames.boolean);
  public static readonly string: PrimitiveType = new PrimitiveType(TypeNames.string);
  public static readonly number: PrimitiveType = new PrimitiveType(TypeNames.number);
  public static readonly date: PrimitiveType = new PrimitiveType(TypeNames.date);

  public readonly variableTypeName = VariableTypeName.PrimitiveType;

  public type: string;

  private constructor(type: string) {
    super();
    this.type = type;
  }

  public equals(other: PrimitiveType): boolean {
    return other != null && this.type == other.type;
  }

  public toString() {
    return this.type;
  }
}