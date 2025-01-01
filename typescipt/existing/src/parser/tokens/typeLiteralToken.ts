namespace Lexy.Compiler.Parser.Tokens;


/* public class TypeLiteralToken : Token
{
   public Types TypeValue { get; }

   public override string Value => TypeValue.ToString().ToLowerInvariant();

   public TypeLiteralToken(Types type)
   {
     TypeValue = type;
   }

   public static TypeLiteralToken Parse(string value)
   {
     if (!IsValid(value)) throw new InvalidOperationException("Couldn't parse boolean: " + value);

     var type = TypeNames.ConvertToType(value);
     return new TypeLiteralToken(type);
   }

   public static bool IsValid(string value)
   {
     return TypeNames.Contains(value);
   }
} */
