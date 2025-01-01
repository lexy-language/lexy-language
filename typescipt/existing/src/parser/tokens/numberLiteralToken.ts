




namespace Lexy.Compiler.Parser.Tokens;

public class NumberLiteralToken : ParsableToken, ILiteralToken
{
   private readonly char[] allowedNextTokensValues =
   {
     TokenValues.TableSeparator,
     TokenValues.Space,
     TokenValues.Assignment,

     TokenValues.Addition,
     TokenValues.Subtraction,
     TokenValues.Multiplication,
     TokenValues.Division,
     TokenValues.Modulus,
     TokenValues.CloseParentheses,
     TokenValues.CloseBrackets,
     TokenValues.GreaterThan,
     TokenValues.LessThan,
     TokenValues.ArgumentSeparator
   };

   private bool hasDecimalSeparator;
   private decimal? numberValue;

   public decimal NumberValue
   {
     get
     {
       if (!numberValue.HasValue) throw new InvalidOperationException("NumberLiteralToken not finalized.");
       return numberValue.Value;
     }
   }

   public NumberLiteralToken(decimal value, TokenCharacter character) : base(character)
   {
     numberValue = value;
   }

   public NumberLiteralToken(TokenCharacter character) : base(character)
   {
   }

   public override string Value => numberValue.HasValue
     ? numberValue.Value.ToString(CultureInfo.InvariantCulture)
     : base.Value;

   public object TypedValue => NumberValue;

   public VariableType DeriveType(IValidationContext context)
   {
     return PrimitiveType.Number;
   }

   public override ParseTokenResult Parse(TokenCharacter character)
   {
     var value = character.Value;
     if (char.IsDigit(value))
     {
       AppendValue(value);
       return ParseTokenResult.InProgress();
     }

     if (value = TokenValues.DecimalSeparator)
     {
       if (hasDecimalSeparator) return ParseTokenResult.Invalid("Only one decimal separator expected");

       hasDecimalSeparator = true;
       AppendValue(value);
       return ParseTokenResult.InProgress();
     }

     return allowedNextTokensValues.Contains(value)
       ? Finalize()
       : ParseTokenResult.Invalid($"Invalid number token character: '{value}'");
   }

   public override ParseTokenResult Finalize()
   {
     numberValue = decimal.Parse(base.Value, CultureInfo.InvariantCulture);
     return ParseTokenResult.Finished(false);
   }

   public bool IsDecimal()
   {
     return numberValue.HasValue & numberValue % 1 ! 0;
   }

   public override string ToString()
   {
     return Value;
   }
}
