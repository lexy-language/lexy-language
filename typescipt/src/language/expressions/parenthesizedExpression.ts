import {Expression} from "./Expression";

export class ParenthesizedExpression extends Expression {

  public nodeType: "ParenthesizedExpression"

  public Expression Expression

  constructor(Expression expression, ExpressionSource source, SourceReference reference) : base(
     source, reference) {
     Expression = expression ?? throw new Error(nameof(expression));
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!IsValid(tokens)) return newParseExpressionFailed(ParenthesizedExpression>(`Not valid.`);

     let matchingClosingParenthesis = FindMatchingClosingParenthesis(tokens);
     if (matchingClosingParenthesis == -1)
       return newParseExpressionFailed(ParenthesizedExpression>(`No closing parentheses found.`);

     let innerExpressionTokens = tokens.tokensRange(1, matchingClosingParenthesis - 1);
     let innerExpression = ExpressionFactory.parse(innerExpressionTokens, source.line);
     if (!innerExpression.state != 'success') return innerExpression;

     let reference = source.createReference();

     let expression = new ParenthesizedExpression(innerExpression.result, source, reference);
     return newParseExpressionSuccess(expression);
   }

   internal static findMatchingClosingParenthesis(tokens: TokenList): number {
     if (tokens == null) throw new Error(nameof(tokens));

     let count = 0;
     for (let index = 0; index < tokens.length; index++) {
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
     return tokens.operatorToken(0, OperatorType.OpenParentheses);
   }

   public override getChildren(): Array<INode> {
     yield return Expression;
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType {
     return Expression.deriveType(context);
   }
}
