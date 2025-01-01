

namespace Lexy.Compiler.Language.Scenarios;

public class ConstantValue
{
   public object Value { get; }

   private ConstantValue(object value)
   {
     Value = value;
   }

   public static ConstantValueParseResult Parse(Expression expression)
   {
     return expression switch
     {
       LiteralExpression literalExpression => Parse(literalExpression),
       MemberAccessExpression literalExpression => Parse(literalExpression),
       _ => ConstantValueParseResult.Failed("Invalid expression variable. Expected: 'Variable = ConstantValue'")
     };
   }

   private static ConstantValueParseResult Parse(LiteralExpression literalExpression)
   {
     var value = new ConstantValue(literalExpression.Literal.TypedValue);
     return ConstantValueParseResult.Success(value);
   }

   private static ConstantValueParseResult Parse(MemberAccessExpression literalExpression)
   {
     return ConstantValueParseResult.Success(new ConstantValue(literalExpression.MemberAccessLiteral.Value));
   }
}
