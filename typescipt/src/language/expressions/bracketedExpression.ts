

export class BracketedExpression extends Expression {
   public string FunctionName
   public Expression Expression

   private BracketedExpression(string functionName, Expression expression,
     ExpressionSource source, SourceReference reference) : base(source, reference) {
     FunctionName = functionName;
     Expression = expression;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<BracketedExpression>(`Not valid.`);

     let matchingClosingParenthesis = FindMatchingClosingBracket(tokens);
     if (matchingClosingParenthesis == -1)
       return ParseExpressionResult.Invalid<BracketedExpression>(`No closing bracket found.`);

     let functionName = tokens.TokenValue(0);
     let innerExpressionTokens = tokens.TokensRange(2, matchingClosingParenthesis - 1);
     let innerExpression = ExpressionFactory.Parse(innerExpressionTokens, source.Line);
     if (!innerExpression.IsSuccess) return innerExpression;

     let reference = source.CreateReference();

     let expression = new BracketedExpression(functionName, innerExpression.Result, source, reference);
     return ParseExpressionResult.Success(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.Length > 1
        && tokens.IsTokenType<StringLiteralToken>(0)
        && tokens.OperatorToken(1, OperatorType.OpenBrackets);
   }

   private static findMatchingClosingBracket(tokens: TokenList): number {
     if (tokens == null) throw new Error(nameof(tokens));

     let count = 0;
     for (let index = 0; index < tokens.Length; index++) {
       let token = tokens[index];
       if (!(token is OperatorToken operatorToken)) continue;

       if (operatorToken.Type == OperatorType.OpenBrackets) {
         count++;
       }
       else if (operatorToken.Type == OperatorType.CloseBrackets) {
         count--;
         if (count == 0) return index;
       }
     }

     return -1;
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
