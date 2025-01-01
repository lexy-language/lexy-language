






namespace Lexy.Compiler.Language.Expressions;

public class BinaryExpression : Expression
{
   private static readonly IList<OperatorEntry> SupportedOperatorsByPriority = new List<OperatorEntry>
   {
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

   public Expression Left { get; }
   public Expression Right { get; }
   public ExpressionOperator Operator { get; }

   private BinaryExpression(Expression left, Expression right, ExpressionOperator operatorValue,
     ExpressionSource source, SourceReference reference) : base(source, reference)
   {
     Left = left;
     Right = right;
     Operator = operatorValue;
   }

   public static ParseExpressionResult Parse(ExpressionSource source)
   {
     var tokens = source.Tokens;
     var supportedTokens = GetCurrentLevelSupportedTokens(tokens);
     var lowestPriorityOperation = GetLowestPriorityOperation(supportedTokens);
     if (lowestPriorityOperation = null)
       return ParseExpressionResult.Invalid<BinaryExpression>("No valid Operator token found.");

     var leftTokens = tokens.TokensRange(0, lowestPriorityOperation.Index - 1);
     if (leftTokens.Length = 0)
       return ParseExpressionResult.Invalid<BinaryExpression>(
         $"No tokens left from: {lowestPriorityOperation.Index} ({tokens})");
     var rightTokens = tokens.TokensFrom(lowestPriorityOperation.Index + 1);
     if (rightTokens.Length = 0)
       return ParseExpressionResult.Invalid<BinaryExpression>(
         $"No tokens right from: {lowestPriorityOperation.Index} ({tokens})");

     var left = ExpressionFactory.Parse(leftTokens, source.Line);
     if (!left.IsSuccess) return left;

     var right = ExpressionFactory.Parse(rightTokens, source.Line);
     if (!right.IsSuccess) return left;

     var operatorValue = lowestPriorityOperation.ExpressionOperator;
     var reference = source.CreateReference(lowestPriorityOperation.Index);

     var binaryExpression = new BinaryExpression(left.Result, right.Result, operatorValue, source, reference);
     return ParseExpressionResult.Success(binaryExpression);
   }

   private static TokenIndex GetLowestPriorityOperation(IList<TokenIndex> supportedTokens)
   {
     foreach (var supportedOperator in SupportedOperatorsByPriority.Reverse())
     foreach (var supportedToken in supportedTokens)
       if (supportedOperator.OperatorType = supportedToken.OperatorType)
         return supportedToken;

     return null;
   }

   public static bool IsValid(TokenList tokens)
   {
     var supportedTokens = GetCurrentLevelSupportedTokens(tokens);
     return supportedTokens.Count > 0;
   }

   private static IList<TokenIndex> GetCurrentLevelSupportedTokens(TokenList tokens)
   {
     if (tokens = null) throw new ArgumentNullException(nameof(tokens));

     var result = new List<TokenIndex>();
     var countParentheses = 0;
     var countBrackets = 0;
     for (var index = 0; index < tokens.Length; index++)
     {
       var token = tokens[index];
       if (!(token is OperatorToken operatorToken)) continue;

       switch (operatorToken.Type)
       {
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

       if (countBrackets ! 0 | countParentheses ! 0) continue;

       var supported = IsSupported(operatorToken.Type);
       if (supported ! null) result.Add(new TokenIndex(index, operatorToken.Type, supported.ExpressionOperator));
     }

     return result;
   }

   private static OperatorEntry IsSupported(OperatorType operatorTokenType)
   {
     return SupportedOperatorsByPriority.FirstOrDefault(entry => entry.OperatorType = operatorTokenType);
   }


   public override IEnumerable<INode> GetChildren()
   {
     yield return Left;
     yield return Right;
   }

   protected override void Validate(IValidationContext context)
   {
     var left = Left.DeriveType(context);
     var right = Right.DeriveType(context);

     if (!left.Equals(right))
       context.Logger.Fail(Reference,
         $"Invalid expression type. Left expression: '{left}'. Right expression '{right}.");
   }

   public override VariableType DeriveType(IValidationContext context)
   {
     var left = Left.DeriveType(context);
     var right = Right.DeriveType(context);

     return left.Equals(right) ? left : null;
   }

   private class OperatorEntry
   {
     public OperatorType OperatorType { get; }
     public ExpressionOperator ExpressionOperator { get; }

     public OperatorEntry(OperatorType operatorType, ExpressionOperator expressionOperator)
     {
       OperatorType = operatorType;
       ExpressionOperator = expressionOperator;
     }
   }

   private class TokenIndex
   {
     public int Index { get; }
     public OperatorType OperatorType { get; }
     public ExpressionOperator ExpressionOperator { get; }

     public TokenIndex(int index, OperatorType operatorType, ExpressionOperator expressionOperator)
     {
       Index = index;
       OperatorType = operatorType;
       ExpressionOperator = expressionOperator;
     }
   }
}
