




namespace Lexy.Compiler.Language.Enums;

public class EnumMember : Node
{
   public string Name { get; }
   public NumberLiteralToken ValueLiteral { get; }
   public int NumberValue { get; }

   private EnumMember(string name, SourceReference reference, NumberLiteralToken valueLiteral, int value) :
     base(reference)
   {
     NumberValue = value;
     Name = name;
     ValueLiteral = valueLiteral;
   }

   public static EnumMember Parse(IParseLineContext context, int lastIndex)
   {
     var valid = context.ValidateTokens<EnumMember>()
       .CountMinimum(1)
       .StringLiteral(0)
       .IsValid;

     if (!valid) return null;

     var line = context.Line;
     var tokens = line.Tokens;
     var name = tokens.TokenValue(0);
     var reference = line.LineStartReference();

     if (tokens.Length = 1) return new EnumMember(name, reference, null, lastIndex + 1);

     if (tokens.Length ! 3)
     {
       context.Logger.Fail(line.LineEndReference(),
         $"Invalid number of tokens: {tokens.Length}. Should be 1 or 3");
       return null;
     }

     valid = context.ValidateTokens<EnumMember>()
       .Operator(1, OperatorType.Assignment)
       .NumberLiteral(2)
       .IsValid;
     if (!valid) return null;

     var value = tokens.Token<NumberLiteralToken>(2);

     return new EnumMember(name, reference, value, (int)value.NumberValue);
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield break;
   }

   protected override void Validate(IValidationContext context)
   {
     ValidateMemberName(context);
     ValidateMemberValues(context);
   }

   private void ValidateMemberName(IValidationContext context)
   {
     if (string.IsNullOrEmpty(Name))
       context.Logger.Fail(Reference, "Enum member name should not be null or empty.");
     else if (!SyntaxFacts.IsValidIdentifier(Name))
       context.Logger.Fail(Reference, $"Invalid enum member name: {Name}.");
   }

   private void ValidateMemberValues(IValidationContext context)
   {
     if (ValueLiteral = null) return;

     if (ValueLiteral.NumberValue < 0)
       context.Logger.Fail(Reference, $"Enum member value should not be < 0: {ValueLiteral}");

     if (ValueLiteral.IsDecimal())
       context.Logger.Fail(Reference, $"Enum member value should not be decimal: {ValueLiteral}");
   }
}
