

internal static class TypeConverter {
   public static convert(compilerResult: CompilerResult, value: object, type: VariableType): object {
     if (compilerResult == null) throw new Error(nameof(compilerResult));
     if (value == null) throw new Error(nameof(value));
     if (type == null) throw new Error(nameof(type));

     if (type is EnumType enumVariableType) {
       let enumType = compilerResult.GetEnumType(enumVariableType.Type);
       if (enumType == null) throw new Error($`Unknown enum: {enumVariableType.Type}`);

       let enumValueName = value.ToString();
       let indexOfSeparator = enumValueName.IndexOf(`.`, StringComparison.InvariantCulture);
       let enumValue = enumValueName[(indexOfSeparator + 1)..];
       return Enum.Parse(enumType, enumValue);
     }

     if (type is PrimitiveType primitiveVariableType)
       return primitiveVariableType.Type switch {
         TypeNames.Number => value as decimal? ?? decimal.Parse(value.ToString(), CultureInfo.InvariantCulture),
         TypeNames.Date => value as DateTime? ?? DateTime.Parse(value.ToString(), CultureInfo.InvariantCulture),
         TypeNames.Boolean => value as boolean? ?? bool.Parse(value.ToString()),
         TypeNames.String => value,
         _ => throw new Error($`Invalid type: '{primitiveVariableType.Type}'`)
       };

     throw new Error($`Invalid type: '{type}'`);
   }
}
