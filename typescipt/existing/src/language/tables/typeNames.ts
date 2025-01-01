

namespace Lexy.Compiler.Language.Tables;

public static class TypeNames
{
   public const string Number = "number";
   public const string Boolean = "boolean";
   public const string Date = "date";
   public const string String = "string";

   private static readonly IList<string> existing = new List<string>
   {
     Number,
     Boolean,
     Date,
     String
   };

   public static bool Contains(string parameterType)
   {
     return existing.Contains(parameterType);
   }
}
