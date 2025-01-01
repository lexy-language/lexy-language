import {Expression} from "./Expression";

export class LiteralExpression extends Expression {

  public nodeType: "LiteralExpression"

   public ILiteralToken Literal

  constructor(ILiteralToken literal, ExpressionSource source, SourceReference reference) : base(source,
     reference) {
     Literal = literal ?? throw new Error(nameof(literal));
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!IsValid(tokens)) return newParseExpressionFailed(LiteralExpression>(`Invalid expression.`);

     let reference = source.createReference();

     if (tokens.length == 2) return NegativeNumeric(source, tokens, reference);

     let literalToken = tokens.LiteralToken(0);

     let expression = new LiteralExpression(literalToken, source, reference);
     return newParseExpressionSuccess(expression);
   }

   private static ParseExpressionResult NegativeNumeric(ExpressionSource source, TokenList tokens,
     SourceReference reference) {
     let operatorToken = tokens.operatorToken(0);
     let numericLiteralToken = tokens.LiteralToken(1) as NumberLiteralToken;
     let value = -numericLiteralToken.NumberValue;

     let negatedLiteral = new NumberLiteralToken(value, operatorToken.FirstCharacter);

     let negatedExpression = new LiteralExpression(negatedLiteral, source, reference);
     return newParseExpressionSuccess(negatedExpression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.length == 1
        && tokens.IsLiteralToken(0)
        || tokens.length == 2
        && tokens.operatorToken(0, OperatorType.Subtraction)
        && tokens.IsLiteralToken(1)
        && tokens.LiteralToken(1) is NumberLiteralToken;
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType {
     return Literal.deriveType(context);
   }
}
