

export class IfExpression extends Expression, IParsableNode {
   private readonly ExpressionList trueExpressions;

   public Expression Condition
   public Array<Expression> TrueExpressions => trueExpressions;

   public ElseExpression Else { get; set; }

   private IfExpression(Expression condition, ExpressionSource source, SourceReference reference) : base(source,
     reference) {
     Condition = condition;
     trueExpressions = new ExpressionList(reference);
   }

   public parse(context: IParseLineContext): IParsableNode {
     let expression = trueExpressions.Parse(context);
     return expression.Result is IParsableNode node ? node : this;
   }

   public override getChildren(): Array<INode> {
     yield return Condition;
     yield return trueExpressions;
     if (Else != null) yield return Else;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<IfExpression>(`Not valid.`);

     if (tokens.Length == 1) return ParseExpressionResult.Invalid<IfExpression>(`No condition found`);

     let condition = tokens.TokensFrom(1);
     let conditionExpression = ExpressionFactory.Parse(condition, source.Line);
     if (!conditionExpression.IsSuccess) return conditionExpression;

     let reference = source.CreateReference();

     let expression = new IfExpression(conditionExpression.Result, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.IsKeyword(0, Keywords.If);
   }

   protected override validate(context: IValidationContext): void {
     let type = Condition.DeriveType(context);
     if (type == null || !type.Equals(PrimitiveType.Boolean))
       context.Logger.Fail(Reference,
         $`'if' condition expression should be 'boolean', is of wrong type '{type}'.`);
   }

   internal linkElse(elseExpression: ElseExpression): void {
     if (Else != null) throw new Error(`'else' already linked.`);

     Else = elseExpression;
   }

   public override deriveType(context: IValidationContext): VariableType {
     return null;
   }
}
