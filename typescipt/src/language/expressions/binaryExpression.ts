

export class BinaryExpression extends Expression {
   private static readonly Array<OperatorEntry> SupportedOperatorsByPriority = new Array<OperatorEntry> {
     new(OperatorType.Multiplication, ExpressionOperator.Multiplication),
     new(OperatorType.Division, ExpressionOperator.Division),
     new(OperatorType.Modulus, ExpressionOperator.Modulus),

     new(OperatorType.Addition, ExpressionOperator.Addition),
     new(OperatorType.Subtraction, ExpressionOperator.Subtraction),

     new(OperatorType.GreaterThan, ExpressionOperator.GreaterThan),
     new(OperatorType.GreaterThanOrEqual, ExpressionOperator.GreaterThanOrEqual),
     new(OperatorType.LessThan, ExpressionOperator.LessThan),
     new(OperatorType.LessThanOrEqual, ExpressionOperator.LessThanOrEqual),

     new(OperatorType.Equals, ExpressionOperator.Equals),
     new(OperatorType.NotEqual, ExpressionOperator.NotEqual),

     new(OperatorType.And, ExpressionOperator.And),
     new(OperatorType.Or, ExpressionOperator.Or)
   };

   public Expression Left
   public Expression Right
   public ExpressionOperator Operator

   private BinaryExpression(Expression left, Expression right, ExpressionOperator operatorValue,
     ExpressionSource source, SourceReference reference) : base(source, reference) {
     Left = left;
     Right = right;
     Operator = operatorValue;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     let supportedTokens = GetCurrentLevelSupportedTokens(tokens);
     let lowestPriorityOperation = GetLowestPriorityOperation(supportedTokens);
     if (lowestPriorityOperation == null)
       return ParseExpressionResult.Invalid<BinaryExpression>(`No valid Operator token found.`);

     let leftTokens = tokens.TokensRange(0, lowestPriorityOperation.Index - 1);
     if (leftTokens.Length == 0)
       return ParseExpressionResult.Invalid<BinaryExpression>(
         $`No tokens left from: {lowestPriorityOperation.Index} ({tokens})`);
     let rightTokens = tokens.TokensFrom(lowestPriorityOperation.Index + 1);
     if (rightTokens.Length == 0)
       return ParseExpressionResult.Invalid<BinaryExpression>(
         $`No tokens right from: {lowestPriorityOperation.Index} ({tokens})`);

     let left = ExpressionFactory.Parse(leftTokens, source.Line);
     if (!left.IsSuccess) return left;

     let right = ExpressionFactory.Parse(rightTokens, source.Line);
     if (!right.IsSuccess) return left;

     let operatorValue = lowestPriorityOperation.ExpressionOperator;
     let reference = source.CreateReference(lowestPriorityOperation.Index);

     let binaryExpression = new BinaryExpression(left.Result, right.Result, operatorValue, source, reference);
     return ParseExpressionResult.Success(binaryExpression);
   }

   private static getLowestPriorityOperation(supportedTokens: Array<TokenIndex>): TokenIndex {
     foreach (let supportedOperator in SupportedOperatorsByPriority.Reverse())
     foreach (let supportedToken in supportedTokens)
       if (supportedOperator.OperatorType == supportedToken.OperatorType)
         return supportedToken;

     return null;
   }

   public static isValid(tokens: TokenList): boolean {
     let supportedTokens = GetCurrentLevelSupportedTokens(tokens);
     return supportedTokens.Count > 0;
   }

   private static getCurrentLevelSupportedTokens(tokens: TokenList): Array<TokenIndex> {
     if (tokens == null) throw new Error(nameof(tokens));

     let result = new Array<TokenIndex>();
     let countParentheses = 0;
     let countBrackets = 0;
     for (let index = 0; index < tokens.Length; index++) {
       let token = tokens[index];
       if (!(token is OperatorToken operatorToken)) continue;

       switch (operatorToken.Type) {
         case OperatorType.OpenParentheses:
           countParentheses++;
           break;
         case OperatorType.CloseParentheses:
           countParentheses--;
           break;
         case OperatorType.OpenBrackets:
           countBrackets++;
           break;
         case OperatorType.CloseBrackets:
           countBrackets--;
           break;
       }

       if (countBrackets != 0 || countParentheses != 0) continue;

       let supported = IsSupported(operatorToken.Type);
       if (supported != null) result.Add(new TokenIndex(index, operatorToken.Type, supported.ExpressionOperator));
     }

     return result;
   }

   private static isSupported(operatorTokenType: OperatorType): OperatorEntry {
     return SupportedOperatorsByPriority.FirstOrDefault(entry => entry.OperatorType == operatorTokenType);
   }


   public override getChildren(): Array<INode> {
     yield return Left;
     yield return Right;
   }

   protected override validate(context: IValidationContext): void {
     let left = Left.DeriveType(context);
     let right = Right.DeriveType(context);

     if (!left.Equals(right))
       context.Logger.Fail(Reference,
         $`Invalid expression type. Left expression: '{left}'. Right expression '{right}.`);
   }

   public override deriveType(context: IValidationContext): VariableType {
     let left = Left.DeriveType(context);
     let right = Right.DeriveType(context);

     return left.Equals(right) ? left : null;
   }

   private class OperatorEntry {
     public OperatorType OperatorType
     public ExpressionOperator ExpressionOperator

     operatorEntry(operatorType: OperatorType, expressionOperator: ExpressionOperator): public {
       OperatorType = operatorType;
       ExpressionOperator = expressionOperator;
     }
   }

   private class TokenIndex {
     public number Index
     public OperatorType OperatorType
     public ExpressionOperator ExpressionOperator

     tokenIndex(index: number, operatorType: OperatorType, expressionOperator: ExpressionOperator): public {
       Index = index;
       OperatorType = operatorType;
       ExpressionOperator = expressionOperator;
     }
   }
}
