


namespace Lexy.Compiler.Language;

public interface IDependantExpression
{
   void LinkPreviousExpression(Expression expression, IParseLineContext context);
}
