

export class ElseExpression extends Expression, IParsableNode, IDependantExpression {
   private readonly ExpressionList falseExpressions;

   public Array<Expression> FalseExpressions => falseExpressions;

   private ElseExpression(ExpressionSource source, SourceReference reference) : base(source, reference) {
     falseExpressions = new ExpressionList(reference);
   }

   public linkPreviousExpression(expression: Expression, context: IParseLineContext): void {
     if (expression is not IfExpression ifExpression) {
       context.Logger.Fail(Reference, `Else should be following an If statement. No if statement found.`);
       return;
     }

     ifExpression.LinkElse(this);
   }

   public override getChildren(): Array<INode> {
     foreach (let expression in FalseExpressions) yield return expression;
   }

   public parse(context: IParseLineContext): IParsableNode {
     let expression = falseExpressions.Parse(context);
     return expression.Result is IParsableNode node ? node : this;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<ElseExpression>(`Not valid.`);

     if (tokens.Length > 1) return ParseExpressionResult.Invalid<ElseExpression>(`No tokens expected.`);

     let reference = source.CreateReference();

     let expression = new ElseExpression(source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.IsKeyword(0, Keywords.Else);
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType {
     return null;
   }
}
