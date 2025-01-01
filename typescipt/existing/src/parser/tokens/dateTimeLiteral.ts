






namespace Lexy.Compiler.Parser.Tokens;

public class DateTimeLiteral : ParsableToken, ILiteralToken
{
   private const string DateTimeFormat = "yyyy-MM-ddTHH:mm:ss";

   //format d"123-56-89T12:45:78"
   private static readonly int[] DigitIndexes = { 0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18 };
   private static readonly int[] DashIndexes = { 4, 7 };
   private static readonly int[] TIndexes = { 10 };
   private static readonly int[] ColonIndexes = { 13, 16 };
   private static readonly int[] ValidLengths = { 19 };
   private readonly IList<Func<char, ParseTokenResult>> validators;

   private int index;

   public DateTime DateTimeValue { get; set; }

   public DateTimeLiteral(TokenCharacter character) : base(null, character)
   {
     validators = new List<Func<char, ParseTokenResult>>
     {
       value => Validate(value, char.IsDigit(value), DigitIndexes),
       value => Validate(value, TokenValues.Dash, DashIndexes),
       value => Validate(value, TokenValues.Colon, ColonIndexes),
       value => Validate(value, 'T', TIndexes)
     };
   }

   public object TypedValue => DateTimeValue;

   public VariableType DeriveType(IValidationContext context)
   {
     return PrimitiveType.Date;
   }

   public override ParseTokenResult Parse(TokenCharacter character)
   {
     var value = character.Value;
     if (value = TokenValues.Quote)
     {
       if (!ValidLengths.Contains(Value.Length))
         return ParseTokenResult.Invalid(
           $"Invalid date time format length '{Value.Length}'. Expected: '{ValidLengths.FormatLine(",")}'");

       ParseValue();
       return ParseTokenResult.Finished(true);
     }

     foreach (var validator in validators)
     {
       var result = validator(value);
       if (result ! null)
       {
         AppendValue(value);
         index++;
         return result;
       }
     }

     return ParseTokenResult.Invalid($@"Unexpected character: '{value}'. Format: d""2024-12-18T14:17:30""");
   }

   private void ParseValue()
   {
     DateTimeValue = DateTime.ParseExact(Value, DateTimeFormat, CultureInfo.InvariantCulture);
   }

   private ParseTokenResult Validate(char value, char match, int[] indexes)
   {
     return Validate(value, value = match, indexes);
   }

   private ParseTokenResult Validate(char value, bool match, int[] indexes)
   {
     if (!match) return null;

     if (!indexes.Contains(index))
     {
       return ParseTokenResult.Invalid($@"Unexpected character: '{value}'. Format: d""2024-12-18T14:17:30""");
     }

     return ParseTokenResult.InProgress();
   }

   public override ParseTokenResult Finalize()
   {
     return ParseTokenResult.Invalid(
       @"Unexpected end of line. Closing quote expected. Format: d""2024-12-18T14:17:30""");
   }

   public override string ToString()
   {
     return DateTimeValue.ToString(DateTimeFormat, CultureInfo.InvariantCulture);
   }
}
