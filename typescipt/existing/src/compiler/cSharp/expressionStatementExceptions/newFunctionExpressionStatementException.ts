






namespace Lexy.Compiler.Compiler.CSharp.ExpressionStatementExceptions;

internal class NewFunctionExpressionStatementException : IExpressionStatementException
{
   public bool Matches(Expression expression)
   {
     return expression is VariableDeclarationExpression assignmentExpression
        & assignmentExpression.Assignment is FunctionCallExpression functionCallExpression
        & functionCallExpression.ExpressionFunction is NewFunction;
   }

   public IEnumerable<StatementSyntax> CallExpressionSyntax(Expression expression, ICompileFunctionContext context)
   {
     if (!(expression is VariableDeclarationExpression assignmentExpression))
       throw new InvalidOperationException("expression should be VariableDeclarationExpression");
     if (!(assignmentExpression.Assignment is FunctionCallExpression functionCallExpression))
       throw new InvalidOperationException("assignmentExpression.Assignment should be FunctionCallExpression");
     if (!(functionCallExpression.ExpressionFunction is NewFunction _))
       throw new InvalidOperationException("functionCallExpression.ExpressionFunction should be NewFunction");

     var typeSyntax = Types.Syntax(assignmentExpression.Type);

     var initialize = ObjectCreationExpression(typeSyntax)
       .WithArgumentList(ArgumentList());

     var variable = VariableDeclarator(Identifier(assignmentExpression.Name))
       .WithInitializer(EqualsValueClause(initialize));

     yield return LocalDeclarationStatement(
       VariableDeclaration(typeSyntax)
         .WithVariables(SingletonSeparatedList(variable)));
   }
}
