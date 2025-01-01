

export class EnumMember extends Node {
   public string Name
   public NumberLiteralToken ValueLiteral
   public number NumberValue

   constructor(name: string, reference: SourceReference, valueLiteral: NumberLiteralToken, value: number) :
     base(reference) {
     NumberValue = value;
     Name = name;
     ValueLiteral = valueLiteral;
   }

   public static parse(context: IParseLineContext, lastIndex: number): EnumMember {
     let valid = context.ValidateTokens<EnumMember>()
       .CountMinimum(1)
       .StringLiteral(0)
       .IsValid;

     if (!valid) return null;

     let line = context.Line;
     let tokens = line.Tokens;
     let name = tokens.TokenValue(0);
     let reference = line.LineStartReference();

     if (tokens.Length == 1) return new EnumMember(name, reference, null, lastIndex + 1);

     if (tokens.Length != 3) {
       context.Logger.Fail(line.LineEndReference(),
         $`Invalid number of tokens: {tokens.Length}. Should be 1 or 3`);
       return null;
     }

     valid = context.ValidateTokens<EnumMember>()
       .Operator(1, OperatorType.Assignment)
       .NumberLiteral(2)
       .IsValid;
     if (!valid) return null;

     let value = tokens.Token<NumberLiteralToken>(2);

     return new EnumMember(name, reference, value, (number)value.NumberValue);
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
     ValidateMemberName(context);
     ValidateMemberValues(context);
   }

   private validateMemberName(context: IValidationContext): void {
     if (string.IsNullOrEmpty(Name))
       context.Logger.Fail(Reference, `Enum member name should not be null or empty.`);
     else if (!SyntaxFacts.IsValidIdentifier(Name))
       context.Logger.Fail(Reference, $`Invalid enum member name: {Name}.`);
   }

   private validateMemberValues(context: IValidationContext): void {
     if (ValueLiteral == null) return;

     if (ValueLiteral.NumberValue < 0)
       context.Logger.Fail(Reference, $`Enum member value should not be < 0: {ValueLiteral}`);

     if (ValueLiteral.IsDecimal())
       context.Logger.Fail(Reference, $`Enum member value should not be decimal: {ValueLiteral}`);
   }
}
