

export interface ILiteralToken extends IToken {
   object TypedValue

   string Value

   VariableType DeriveType(IValidationContext context);
}
