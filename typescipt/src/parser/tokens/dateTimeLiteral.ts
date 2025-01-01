

export class DateTimeLiteral extends ParsableToken, ILiteralToken {
   private const string DateTimeFormat = `yyyy-MM-ddTHH:mm:ss`;

   //format d`123-56-89T12:45:78`
   private static readonly number[] DigitIndexes = { 0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18 };
   private static readonly number[] DashIndexes = { 4, 7 };
   private static readonly number[] TIndexes = { 10 };
   private static readonly number[] ColonIndexes = { 13, 16 };
   private static readonly number[] ValidLengths = { 19 };
   private readonly Array<Func<char, ParseTokenResult>> validators;

   private number index;

   public DateTime DateTimeValue { get; set; }

   public DateTimeLiteral(TokenCharacter character) : base(null, character) {
     validators = new Array<Func<char, ParseTokenResult>> {
       value => Validate(value, char.IsDigit(value), DigitIndexes),
       value => Validate(value, TokenValues.Dash, DashIndexes),
       value => Validate(value, TokenValues.Colon, ColonIndexes),
       value => Validate(value, 'T', TIndexes)
     };
   }

   public object TypedValue => DateTimeValue;

   public deriveType(context: IValidationContext): VariableType {
     return PrimitiveType.Date;
   }

   public override parse(character: TokenCharacter): ParseTokenResult {
     let value = character.Value;
     if (value == TokenValues.Quote) {
       if (!ValidLengths.Contains(Value.Length))
         return ParseTokenResult.Invalid(
           $`Invalid date time format length '{Value.Length}'. Expected: '{ValidLengths.FormatLine(`,`)}'`);

       ParseValue();
       return ParseTokenResult.Finished(true);
     }

     foreach (let validator in validators) {
       let result = validator(value);
       if (result != null) {
         AppendValue(value);
         index++;
         return result;
       }
     }

     return ParseTokenResult.Invalid($@`Unexpected character: '{value}'. Format: d``2024-12-18T14:17:30```);
   }

   private parseValue(): void {
     DateTimeValue = DateTime.ParseExact(Value, DateTimeFormat, CultureInfo.InvariantCulture);
   }

   private validate(value: char, match: char, indexes: int[]): ParseTokenResult {
     return Validate(value, value == match, indexes);
   }

   private validate(value: char, match: boolean, indexes: int[]): ParseTokenResult {
     if (!match) return null;

     if (!indexes.Contains(index)) {
       return ParseTokenResult.Invalid($@`Unexpected character: '{value}'. Format: d``2024-12-18T14:17:30```);
     }

     return ParseTokenResult.InProgress();
   }

   public override finalize(): ParseTokenResult {
     return ParseTokenResult.Invalid(
       @`Unexpected end of line. Closing quote expected. Format: d``2024-12-18T14:17:30```);
   }

   public override toString(): string {
     return DateTimeValue.ToString(DateTimeFormat, CultureInfo.InvariantCulture);
   }
}
