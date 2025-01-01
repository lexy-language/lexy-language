



namespace Lexy.Compiler.Compiler.CSharp.ExpressionStatementExceptions;

internal interface IExpressionStatementException
{
   bool Matches(Expression expression);

   IEnumerable<StatementSyntax> CallExpressionSyntax(Expression expression, ICompileFunctionContext context);
}
