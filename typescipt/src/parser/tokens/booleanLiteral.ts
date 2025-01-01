

export class BooleanLiteral extends Token, ILiteralToken {
   public boolean BooleanValue

   public BooleanLiteral(boolean value, TokenCharacter character) : base(character) {
     BooleanValue = value;
   }

   public override string Value => BooleanValue ? TokenValues.BooleanTrue : TokenValues.BooleanFalse;

   public object TypedValue => BooleanValue;

   public deriveType(context: IValidationContext): VariableType {
     return PrimitiveType.Boolean;
   }

   public static parse(value: string, character: TokenCharacter): BooleanLiteral {
     return value switch {
       TokenValues.BooleanTrue => new BooleanLiteral(true, character),
       TokenValues.BooleanFalse => new BooleanLiteral(false, character),
       _ => throw new Error($`Couldn't parse boolean: {value}`)
     };
   }

   public static isValid(value: string): boolean {
     return value == TokenValues.BooleanTrue || value == TokenValues.BooleanFalse;
   }

   public override toString(): string {
     return Value;
   }
}
