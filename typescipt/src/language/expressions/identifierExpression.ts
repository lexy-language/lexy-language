

export class IdentifierExpression extends Expression {
   public VariableSource VariableSource { get; private set; }

   public string Identifier

   private IdentifierExpression(string identifier, ExpressionSource source, SourceReference reference) : base(source,
     reference) {
     Identifier = identifier;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<IdentifierExpression>(`Invalid expression`);

     let variableName = tokens.TokenValue(0);
     let reference = source.CreateReference();

     let expression = new IdentifierExpression(variableName, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.Length == 1
        && tokens.IsTokenType<StringLiteralToken>(0);
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
     if (!context.VariableContext.EnsureVariableExists(Reference, Identifier)) return;

     let variableSource = context.VariableContext.GetVariableSource(Identifier);
     if (variableSource == null) {
       context.Logger.Fail(Reference, `Can't define source of variable: ` + Identifier);
       return;
     }

     VariableSource = variableSource.Value;
   }

   public override deriveType(context: IValidationContext): VariableType {
     return context.VariableContext.GetVariableType(Identifier);
   }
}
