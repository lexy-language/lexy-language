

export class TypeNames {
   public const string Number = `number`;
   public const string Boolean = `boolean`;
   public const string Date = `date`;
   public const string String = `string`;

   private static readonly Array<string> existing = new Array<string> {
     Number,
     Boolean,
     Date,
     String
   };

   public static contains(parameterType: string): boolean {
     return existing.contains(parameterType);
   }
}
