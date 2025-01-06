import {CompilerResult} from "../compiler/compilerResult";
import {VariableType} from "../language/variableTypes/variableType";
import {asEnumType, EnumType} from "../language/variableTypes/enumType";
import {asPrimitiveType, PrimitiveType} from "../language/variableTypes/primitiveType";
import {TypeNames} from "../language/variableTypes/typeNames";

export class TypeConverter {
   public static convert(compilerResult: CompilerResult, value: object, type: VariableType): any {

     const enumVariableType = asEnumType(type);
     if (enumVariableType != null) {
       return this.convertEnum(compilerResult, enumVariableType, value);
     }

     const primitiveVariableType = asPrimitiveType(type);
     if (primitiveVariableType != null) {
       return this.convertPrimitive(primitiveVariableType, value);
     }

     throw new Error(`Invalid type: '${type}'`);
   }

  private static convertEnum(compilerResult: CompilerResult, enumVariableType: EnumType, value: object) {
    let enumType = compilerResult.getEnumType(enumVariableType.type);
    if (enumType == null) throw new Error(`Unknown enum: ${enumVariableType.type}`);

    let enumValueName = value.toString();
    let indexOfSeparator = enumValueName.indexOf(`.`);
    let enumValue = enumValueName.substring(indexOfSeparator + 1);
    return enumType[enumValue];
  }

  private static convertPrimitive(primitiveVariableType: PrimitiveType, value: object) {
    switch (primitiveVariableType.type) {
      case TypeNames.number:
        return parseFloat(value.toString());

      case TypeNames.date:
        return new Date(value.toString());

      case TypeNames.boolean:
        return value.toString() === 'true';

      case TypeNames.string:
        return value;
      default:
        throw new Error(`Invalid type: '${primitiveVariableType.type}'`)
    }
  }
}
