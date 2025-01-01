

export class StringLiteralToken extends Token, ILiteralToken {
   public StringLiteralToken(string value, TokenCharacter character) : base(character) {
     Value = value;
   }

   public override string Value

   public object TypedValue => Value;

   public deriveType(context: IValidationContext): VariableType {
     throw new Error(`Not supported. Type should be defined by node or expression.`);
   }

   public override toString(): string {
     return Value;
   }
}
