

namespace Lexy.Compiler.Compiler.CSharp;

public class ValidateTableKeyword
{
   private static readonly IList<ValidateTableKeywordRow> _value = new List<ValidateTableKeywordRow>();

   public int Count => _value.Count;
   public IEnumerable<ValidateTableKeywordRow> Value => _value;

   static ValidateTableKeyword()
   {
     _value.Add(new ValidateTableKeywordRow
     {
       Value = 0,
       Result = 0
     });
     _value.Add(new ValidateTableKeywordRow
     {
       Value = 1,
       Result = 1
     });
   }

   public class ValidateTableKeywordRow
   {
     public int Value { get; set; }
     public int Result { get; set; }
   }
}
