

export class ClassNames {
   public static functionClassName(functionName: string): string {
     return Normalize(functionName, LexyCodeConstants.FunctionClassPrefix);
   }

   public static customClassName(complexTypeName: string): string {
     return Normalize(complexTypeName, LexyCodeConstants.ComplexTypeClassPrefix);
   }

   public static tableClassName(tableTypeName: string): string {
     return Normalize(tableTypeName, LexyCodeConstants.TableClassPrefix);
   }

   public static enumClassName(enumName: string): string {
     return Normalize(enumName, LexyCodeConstants.EnumClassPrefix);
   }

   public static typeClassName(enumName: string): string {
     return Normalize(enumName, LexyCodeConstants.TypeClassPrefix);
   }

   private static normalize(functionName: string, functionClassPrefix: string): string {
     let nameBuilder = new StringBuilder(functionClassPrefix);
     foreach (let @char in functionName.Where(ValidCharacter)) nameBuilder.Append(@char);

     return nameBuilder.ToString();
   }

   private static validCharacter(value: char): boolean {
     return char.IsLetterOrDigit(value) || value == '_';
   }
}
