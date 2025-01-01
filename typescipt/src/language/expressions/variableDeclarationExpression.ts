

export class VariableDeclarationExpression extends Expression {
   public VariableDeclarationType Type
   public string Name
   public Expression Assignment

   private VariableDeclarationExpression(VariableDeclarationType variableType, string variableName,
     Expression assignment,
     ExpressionSource source, SourceReference reference) : base(source, reference) {
     Type = variableType ?? throw new Error(nameof(variableType));
     Name = variableName ?? throw new Error(nameof(variableName));
     Assignment = assignment;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens))
       return ParseExpressionResult.Invalid<VariableDeclarationExpression>(`Invalid expression.`);

     let type = VariableDeclarationType.Parse(tokens.TokenValue(0), source.CreateReference());
     let name = tokens.TokenValue(1);
     let assignment = tokens.Length > 3
       ? ExpressionFactory.Parse(tokens.TokensFrom(3), source.Line)
       : null;
     if (assignment is { IsSuccess: false }) return assignment;

     let reference = source.CreateReference();

     let expression = new VariableDeclarationExpression(type, name, assignment?.Result, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.Length == 2
        && tokens.IsKeyword(0, Keywords.ImplicitVariableDeclaration)
        && tokens.IsTokenType<StringLiteralToken>(1)
        || tokens.Length == 2
        && tokens.IsTokenType<StringLiteralToken>(0)
        && tokens.IsTokenType<StringLiteralToken>(1)
        || tokens.Length >= 4
        && tokens.IsKeyword(0, Keywords.ImplicitVariableDeclaration)
        && tokens.IsTokenType<StringLiteralToken>(1)
        && tokens.OperatorToken(2, OperatorType.Assignment)
        || tokens.Length >= 4
        && tokens.IsTokenType<StringLiteralToken>(0)
        && tokens.IsTokenType<StringLiteralToken>(1)
        && tokens.OperatorToken(2, OperatorType.Assignment);
   }

   public override getChildren(): Array<INode> {
     if (Assignment != null) yield return Assignment;
     yield return Type;
   }

   protected override validate(context: IValidationContext): void {
     let assignmentType = Assignment?.DeriveType(context);
     if (Assignment != null && assignmentType == null)
       context.Logger.Fail(Reference, `Invalid expression. Could not derive type.`);

     let variableType = GetVariableType(context, assignmentType);
     if (variableType == null) context.Logger.Fail(Reference, $`Invalid variable type '{Type}'`);

     context.VariableContext.RegisterVariableAndVerifyUnique(Reference, Name, variableType, VariableSource.Code);
   }

   private getVariableType(context: IValidationContext, assignmentType: VariableType): VariableType {
     if (Type is ImplicitVariableDeclaration implicitVariableType) {
       implicitVariableType.Define(assignmentType);
       return assignmentType;
     }

     let variableType = Type.CreateVariableType(context);
     if (Assignment != null && !assignmentType.Equals(variableType)) {
       context.Logger.Fail(Reference, `Invalid expression. Literal or enum value expression expected.`);
     }

     return variableType;
   }

   public override deriveType(context: IValidationContext): VariableType {
     return null;
   }
}
