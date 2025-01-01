

internal interface IExpressionStatementException {
   boolean Matches(Expression expression);

   Array<StatementSyntax> CallExpressionSyntax(Expression expression, ICompileFunctionContext context);
}
