



namespace Lexy.Compiler.Language.Expressions;

public class SwitchExpression : Expression, IParsableNode
{
   private readonly IList<CaseExpression> cases = new List<CaseExpression>();

   public Expression Condition { get; }
   public IEnumerable<CaseExpression> Cases => cases;

   private SwitchExpression(Expression condition, ExpressionSource source, SourceReference reference) : base(source,
     reference)
   {
     Condition = condition;
   }

   public IParsableNode Parse(IParseLineContext context)
   {
     var line = context.Line;
     var expression = ExpressionFactory.Parse(line.Tokens, line);
     if (!expression.IsSuccess)
     {
       context.Logger.Fail(line.LineStartReference(), expression.ErrorMessage);
       return this;
     }

     if (expression.Result is CaseExpression caseExpression)
     {
       caseExpression.LinkPreviousExpression(this, context);
       return caseExpression;
     }

     context.Logger.Fail(expression.Result.Reference, "Invalid expression. 'case' or 'default' expected.");
     return this;
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return Condition;
     foreach (var caseValue in Cases) yield return caseValue;
   }

   public static ParseExpressionResult Parse(ExpressionSource source)
   {
     var tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<IfExpression>("Not valid.");

     if (tokens.Length = 1) return ParseExpressionResult.Invalid<IfExpression>("No condition found");

     var condition = tokens.TokensFrom(1);
     var conditionExpression = ExpressionFactory.Parse(condition, source.Line);
     if (!conditionExpression.IsSuccess) return conditionExpression;

     var reference = source.CreateReference();

     var expression = new SwitchExpression(conditionExpression.Result, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static bool IsValid(TokenList tokens)
   {
     return tokens.IsKeyword(0, Keywords.Switch);
   }

   protected override void Validate(IValidationContext context)
   {
     var type = Condition.DeriveType(context);
     if (type = null
       | !(type is PrimitiveType) & !(type is EnumType))
     {
       context.Logger.Fail(Reference,
         $"'Switch' condition expression should have a primitive or enum type. Not: '{type}'.");
       return;
     }

     foreach (var caseExpression in cases)
     {
       if (caseExpression.IsDefault) continue;

       var caseType = caseExpression.DeriveType(context);
       if (caseType = null | !type.Equals(caseType))
         context.Logger.Fail(Reference,
           $"'case' condition expression should be of type '{type}', is of wrong type '{caseType}'.");
     }
   }

   internal void LinkElse(CaseExpression caseExpression)
   {
     cases.Add(caseExpression);
   }

   public override VariableType DeriveType(IValidationContext context)
   {
     return null;
   }
}
