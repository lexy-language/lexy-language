

export class CaseExpression extends Expression, IParsableNode, IDependantExpression {
   private readonly ExpressionList expressions;

   public Expression Value
   public Array<Expression> Expressions => expressions;
   public boolean IsDefault

   private CaseExpression(Expression value, boolean isDefault, ExpressionSource source, SourceReference reference) : base(
     source, reference) {
     Value = value;
     IsDefault = isDefault;
     expressions = new ExpressionList(reference);
   }

   public linkPreviousExpression(expression: Expression, context: IParseLineContext): void {
     if (expression is not SwitchExpression switchExpression) {
       context.Logger.Fail(Reference,
         `'case' should be following a 'switch' statement. No 'switch' statement found.`);
       return;
     }

     switchExpression.LinkElse(this);
   }

   public parse(context: IParseLineContext): IParsableNode {
     let expression = expressions.Parse(context);
     return expression.Result is IParsableNode node ? node : this;
   }

   public override getChildren(): Array<INode> {
     if (Value != null) yield return Value;

     yield return expressions;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<IfExpression>(`Not valid.`);

     if (tokens.IsKeyword(0, Keywords.Default)) return ParseDefaultCase(source, tokens);

     if (tokens.Length == 1)
       return ParseExpressionResult.Invalid<CaseExpression>(`Invalid 'case'. No parameters found.`);

     let value = tokens.TokensFrom(1);
     let valueExpression = ExpressionFactory.Parse(value, source.Line);
     if (!valueExpression.IsSuccess) return valueExpression;

     let reference = source.CreateReference();

     let expression = new CaseExpression(valueExpression.Result, false, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   private static parseDefaultCase(source: ExpressionSource, tokens: TokenList): ParseExpressionResult {
     if (tokens.Length != 1)
       return ParseExpressionResult.Invalid<CaseExpression>(`Invalid 'default' case. No parameters expected.`);

     let reference = source.CreateReference();
     let expression = new CaseExpression(null, true, source, reference);
     return ParseExpressionResult.Success(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.IsKeyword(0, Keywords.Case)
        || tokens.IsKeyword(0, Keywords.Default);
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType {
     return Value?.DeriveType(context);
   }
}
