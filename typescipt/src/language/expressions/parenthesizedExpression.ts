

export class ParenthesizedExpression extends Expression {
   public Expression Expression

   private ParenthesizedExpression(Expression expression, ExpressionSource source, SourceReference reference) : base(
     source, reference) {
     Expression = expression ?? throw new Error(nameof(expression));
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<ParenthesizedExpression>(`Not valid.`);

     let matchingClosingParenthesis = FindMatchingClosingParenthesis(tokens);
     if (matchingClosingParenthesis == -1)
       return ParseExpressionResult.Invalid<ParenthesizedExpression>(`No closing parentheses found.`);

     let innerExpressionTokens = tokens.TokensRange(1, matchingClosingParenthesis - 1);
     let innerExpression = ExpressionFactory.Parse(innerExpressionTokens, source.Line);
     if (!innerExpression.IsSuccess) return innerExpression;

     let reference = source.CreateReference();

     let expression = new ParenthesizedExpression(innerExpression.Result, source, reference);
     return ParseExpressionResult.Success(expression);
   }

   internal static findMatchingClosingParenthesis(tokens: TokenList): number {
     if (tokens == null) throw new Error(nameof(tokens));

     let count = 0;
     for (let index = 0; index < tokens.Length; index++) {
       let token = tokens[index];
       if (!(token is OperatorToken operatorToken)) continue;

       if (operatorToken.Type == OperatorType.OpenParentheses) {
         count++;
       }
       else if (operatorToken.Type == OperatorType.CloseParentheses) {
         count--;
         if (count == 0) return index;
       }
     }

     return -1;
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.OperatorToken(0, OperatorType.OpenParentheses);
   }

   public override getChildren(): Array<INode> {
     yield return Expression;
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType {
     return Expression.DeriveType(context);
   }
}
