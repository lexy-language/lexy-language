

export class ValidateTableKeyword {
   private static readonly Array<ValidateTableKeywordRow> _value = list<ValidateTableKeywordRow>(): new;

   public number Count => _value.Count;
   public Array<ValidateTableKeywordRow> Value => _value;

   static ValidateTableKeyword() {
     _value.Add(new ValidateTableKeywordRow {
       Value = 0,
       Result = 0
     });
     _value.Add(new ValidateTableKeywordRow {
       Value = 1,
       Result = 1
     });
   }

   public class ValidateTableKeywordRow {
     public number Value { get; set; }
     public number Result { get; set; }
   }
}
