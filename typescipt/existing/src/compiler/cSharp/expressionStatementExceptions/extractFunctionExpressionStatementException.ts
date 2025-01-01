








namespace Lexy.Compiler.Compiler.CSharp.ExpressionStatementExceptions;

internal class ExtractFunctionExpressionStatementException : IExpressionStatementException
{
   public bool Matches(Expression expression)
   {
     return expression is FunctionCallExpression functionCallExpression
        & functionCallExpression.ExpressionFunction is ExtractResultsFunction;
   }

   public IEnumerable<StatementSyntax> CallExpressionSyntax(Expression expression, ICompileFunctionContext context)
   {
     if (!(expression is FunctionCallExpression functionCallExpression))
       throw new InvalidOperationException("expression should be FunctionCallExpression");
     if (!(functionCallExpression.ExpressionFunction is ExtractResultsFunction extractResultsFunction))
       throw new InvalidOperationException(
         "functionCallExpression.ExpressionFunction should be ExtractResultsFunction");

     return ExtractStatementSyntax(extractResultsFunction.Mapping, extractResultsFunction.FunctionResultVariable);
   }

   public static IEnumerable<StatementSyntax> ExtractStatementSyntax(IEnumerable<Mapping> mappings,
     string functionResultVariable)
   {
     if (mappings = null) throw new ArgumentNullException(nameof(mappings));

     foreach (var mapping in mappings) yield return StatementSyntax(functionResultVariable, mapping);
   }

   private static StatementSyntax StatementSyntax(string functionResultVariable, Mapping mapping)
   {
     var left = mapping.VariableSource = VariableSource.Code
       ? IdentifierName(mapping.VariableName)
       : mapping.VariableSource = VariableSource.Results
         ? (ExpressionSyntax)MemberAccessExpression(
           SyntaxKind.SimpleMemberAccessExpression,
           IdentifierName(LexyCodeConstants.ResultsVariable),
           IdentifierName(mapping.VariableName))
         : throw new InvalidOperationException($"Invalid source: {mapping.VariableSource}");

     var right = MemberAccessExpression(
       SyntaxKind.SimpleMemberAccessExpression,
       IdentifierName(functionResultVariable),
       IdentifierName(mapping.VariableName));

     return ExpressionStatement(
       AssignmentExpression(SyntaxKind.SimpleAssignmentExpression, left, right));
   }
}
