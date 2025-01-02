

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
       .isValid;

     if (!valid) return null;

     let line = context.line;
     let tokens = line.tokens;
     let name = tokens.tokenValue(0);
     let reference = line.lineStartReference();

     if (tokens.length == 1) return new EnumMember(name, reference, null, lastIndex + 1);

     if (tokens.length != 3) {
       context.logger.fail(line.lineEndReference(),
         $`Invalid number of tokens: {tokens.length}. Should be 1 or 3`);
       return null;
     }

     valid = context.ValidateTokens<EnumMember>()
       .Operator(1, OperatorType.Assignment)
       .NumberLiteral(2)
       .isValid;
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
       context.logger.fail(this.reference, `Enum member name should not be null or empty.`);
     else if (!SyntaxFacts.IsValidIdentifier(Name))
       context.logger.fail(this.reference, $`Invalid enum member name: {Name}.`);
   }

   private validateMemberValues(context: IValidationContext): void {
     if (ValueLiteral == null) return;

     if (ValueLiteral.NumberValue < 0)
       context.logger.fail(this.reference, $`Enum member value should not be < 0: {ValueLiteral}`);

     if (ValueLiteral.IsDecimal())
       context.logger.fail(this.reference, $`Enum member value should not be decimal: {ValueLiteral}`);
   }
}
