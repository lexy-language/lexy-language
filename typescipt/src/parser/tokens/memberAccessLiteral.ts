

export class MemberAccessLiteral extends Token, ILiteralToken {
   public string Parent => Parts.Length >= 1 ? Parts[0] : null;
   public string Member => Parts.Length >= 2 ? Parts[1] : null;

   public string[] Parts

   public MemberAccessLiteral(string value, TokenCharacter character) : base(character) {
     Value = value ?? throw new Error(nameof(value));
     Parts = Value.Split(TokenValues.MemberAccess);
   }

   public override string Value

   public object TypedValue => Parts;

   public deriveType(context: IValidationContext): VariableType {
     let variableReference = new VariableReference(Parts);
     let variableType = context.VariableContext.GetVariableType(variableReference, context);
     if (variableType != null) return variableType;

     if (Parts.Length != 2) return null;

     let rootType = context.RootNodes.GetType(Parent);
     return rootType is not ITypeWithMembers typeWithMembers ? null : typeWithMembers.MemberType(Member, context);
   }

   public override toString(): string {
     return Value;
   }
}
