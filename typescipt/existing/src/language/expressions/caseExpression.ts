



namespace Lexy.Compiler.Language.Expressions;

public class CaseExpression : Expression, IParsableNode, IDependantExpression
{
   private readonly ExpressionList expressions;

   public Expression Value { get; }
   public IEnumerable<Expression> Expressions => expressions;
   public bool IsDefault { get; }

   private CaseExpression(Expression value, bool isDefault, ExpressionSource source, SourceReference reference) : base(
     source, reference)
   {
     Value = value;
     IsDefault = isDefault;
     expressions = new ExpressionList(reference);
   }

   public void LinkPreviousExpression(Expression expression, IParseLineContext context)
   {
     if (expression is not SwitchExpression switchExpression)
     {
       context.Logger.Fail(Reference,
         "'case' should be following a 'switch' statement. No 'switch' statement found.");
       return;
     }

     switchExpression.LinkElse(this);
   }

   public IParsableNode Parse(IParseLineContext context)
   {
     var expression = expressions.Parse(context);
     return expression.Result is IParsableNode node ? node : this;
   }

   public override IEnumerable<INode> GetChildren()
   {
     if (Value ! null) yield return Value;

     yield return expressions;
   }

   public static ParseExpressionResult Parse(ExpressionSource source)
   {
     var tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<IfExpression>("Not valid.");

     if (tokens.IsKeyword(0, Keywords.Default)) return ParseDefaultCase(source, tokens);

     if (tokens.Length = 1)
       return ParseExpressionResult.Invalid<CaseExpression>("Invalid 'case'. No parameters found.");

     var value = tokens.TokensFrom(1);
     var valueExpression = ExpressionFactory.Parse(value, source.Line);
     if (!valueExpression.IsSuccess) return valueExpression;

     var reference = source.CreateReference();

     var expression = new CaseExpression(valueExpression.Result, false, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   private static ParseExpressionResult ParseDefaultCase(ExpressionSource source, TokenList tokens)
   {
     if (tokens.Length ! 1)
       return ParseExpressionResult.Invalid<CaseExpression>("Invalid 'default' case. No parameters expected.");

     var reference = source.CreateReference();
     var expression = new CaseExpression(null, true, source, reference);
     return ParseExpressionResult.Success(expression);
   }

   public static bool IsValid(TokenList tokens)
   {
     return tokens.IsKeyword(0, Keywords.Case)
        | tokens.IsKeyword(0, Keywords.Default);
   }

   protected override void Validate(IValidationContext context)
   {
   }

   public override VariableType DeriveType(IValidationContext context)
   {
     return Value?.DeriveType(context);
   }
}
