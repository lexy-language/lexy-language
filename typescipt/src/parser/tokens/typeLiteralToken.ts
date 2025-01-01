

/* public class TypeLiteralToken : Token {
   public Types TypeValue

   public override string Value => TypeValue.ToString().ToLowerInvariant();

   typeLiteralToken(type: Types): public {
     TypeValue = type;
   }

   public static parse(value: string): TypeLiteralToken {
     if (!IsValid(value)) throw new Error(`Couldn't parse boolean: ` + value);

     let type = TypeNames.ConvertToType(value);
     return new TypeLiteralToken(type);
   }

   public static isValid(value: string): boolean {
     return TypeNames.Contains(value);
   }
} */
