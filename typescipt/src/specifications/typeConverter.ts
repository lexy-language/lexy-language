

internal static class TypeConverter {
   public static convert(compilerResult: CompilerResult, value: object, type: VariableType): object {
     if (compilerResult == null) throw new Error(nameof(compilerResult));
     if (value == null) throw new Error(nameof(value));
     if (type == null) throw new Error(nameof(type));

     if (type is EnumType enumVariableType) {
       let enumType = compilerResult.GetEnumType(enumVariableType.Type);
       if (enumType == null) throw new Error($`Unknown enum: {enumVariableType.Type}`);

       let enumValueName = value.toString();
       let indexOfSeparator = enumValueName.indexOf(`.`, StringComparison.InvariantCulture);
       let enumValue = enumValueName[(indexOfSeparator + 1)..];
       return Enum.parse(enumType, enumValue);
     }

     if (type is PrimitiveType primitiveVariableType)
       return primitiveVariableType.Type switch {
         TypeNames.Number => value as decimal? ?? decimal.parse(value.toString(), CultureInfo.InvariantCulture),
         TypeNames.Date => value as Date? ?? Date.parse(value.toString(), CultureInfo.InvariantCulture),
         TypeNames.Boolean => value as boolean? ?? bool.parse(value.toString()),
         TypeNames.String => value,
         _ => throw new Error($`Invalid type: '{primitiveVariableType.Type}'`)
       };

     throw new Error($`Invalid type: '{type}'`);
   }
}
