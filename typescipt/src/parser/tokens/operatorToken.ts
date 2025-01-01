

export class OperatorToken extends ParsableToken {
   private static readonly char[] TerminatorValues = {
     TokenValues.Space,
     TokenValues.ArgumentSeparator,
     TokenValues.Subtraction,
     TokenValues.OpenParentheses,
     TokenValues.OpenBrackets,
     TokenValues.CloseParentheses,
     TokenValues.CloseBrackets
   };

   private readonly Array<OperatorCombinations> operatorCombinations = new Array<OperatorCombinations> {
     new(TokenValues.Assignment, null, OperatorType.Assignment),
     new(TokenValues.Addition, null, OperatorType.Addition),
     new(TokenValues.Subtraction, null, OperatorType.Subtraction),
     new(TokenValues.Multiplication, null, OperatorType.Multiplication),
     new(TokenValues.Division, null, OperatorType.Division),
     new(TokenValues.Modulus, null, OperatorType.Modulus),
     new(TokenValues.OpenParentheses, null, OperatorType.OpenParentheses),
     new(TokenValues.CloseParentheses, null, OperatorType.CloseParentheses),
     new(TokenValues.OpenBrackets, null, OperatorType.OpenBrackets),
     new(TokenValues.CloseBrackets, null, OperatorType.CloseBrackets),
     new(TokenValues.GreaterThan, null, OperatorType.GreaterThan),
     new(TokenValues.LessThan, null, OperatorType.LessThan),
     new(TokenValues.ArgumentSeparator, null, OperatorType.ArgumentSeparator),
     new(TokenValues.GreaterThan, TokenValues.Assignment, OperatorType.GreaterThanOrEqual),
     new(TokenValues.LessThan, TokenValues.Assignment, OperatorType.LessThanOrEqual),
     new(TokenValues.Assignment, TokenValues.Assignment, OperatorType.Equals),
     new(TokenValues.NotEqualStart, TokenValues.Assignment, OperatorType.NotEqual),
     new(TokenValues.And, TokenValues.And, OperatorType.And),
     new(TokenValues.Or, TokenValues.Or, OperatorType.Or)
   };

   public OperatorType Type { get; private set; } = OperatorType.NotSet;

   public OperatorToken(TokenCharacter character) : base(character) {
     let operatorValue = character.Value;
     foreach (let combination in operatorCombinations) {
       if (!combination.SecondChar.HasValue && combination.FirstChar == operatorValue) {
         Type = combination.Type;
       }
     }
   }

   public override parse(character: TokenCharacter): ParseTokenResult {
     let value = character.Value;
     if (Value.Length == 1) {
       foreach (let combination in operatorCombinations) {
         if (combination.SecondChar.HasValue
           && combination.SecondChar.Value == value
           && combination.FirstChar == Value[0]) {
           Type = combination.Type;
           AppendValue(value);
           return ParseTokenResult.Finished(true);
         }
       }
     }

     if (char.IsLetterOrDigit(value)
       || TerminatorValues.Contains(value)) {
       if (Value.Length == 1 && Value[0] == TokenValues.TableSeparator)
         return ParseTokenResult.Finished(false, new TableSeparatorToken(FirstCharacter));
       return ParseTokenResult.Finished(false);
     }

     return ParseTokenResult.Invalid($`Invalid token: {value}`);
   }

   public override finalize(): ParseTokenResult {
     if (Value == TokenValues.TableSeparator.ToString())
       return ParseTokenResult.Finished(false, new TableSeparatorToken(FirstCharacter));

     return ParseTokenResult.Finished(false);
   }

   private class OperatorCombinations {
     public char FirstChar
     public char? SecondChar
     public OperatorType Type

     operatorCombinations(firstChar: char, secondChar: char?, type: OperatorType): public {
       FirstChar = firstChar;
       SecondChar = secondChar;
       Type = type;
     }
   }
}
