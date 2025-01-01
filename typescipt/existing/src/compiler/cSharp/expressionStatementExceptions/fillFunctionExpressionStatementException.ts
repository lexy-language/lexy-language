









namespace Lexy.Compiler.Compiler.CSharp.ExpressionStatementExceptions;

internal class FillFunctionExpressionStatementException : IExpressionStatementException
{
   public bool Matches(Expression expression)
   {
     return expression is VariableDeclarationExpression assignmentExpression
        & assignmentExpression.Assignment is FunctionCallExpression functionCallExpression
        & functionCallExpression.ExpressionFunction is FillParametersFunction;
   }

   public IEnumerable<StatementSyntax> CallExpressionSyntax(Expression expression, ICompileFunctionContext context)
   {
     if (!(expression is VariableDeclarationExpression assignmentExpression))
       throw new InvalidOperationException("expression should be AssignmentExpression");
     if (!(assignmentExpression.Assignment is FunctionCallExpression functionCallExpression))
       throw new InvalidOperationException("assignmentExpression.Assignment should be FunctionCallExpression");
     if (!(functionCallExpression.ExpressionFunction is FillParametersFunction fillParametersFunction))
       throw new InvalidOperationException(
         "functionCallExpression.ExpressionFunction should be FillParametersFunction");

     return FillStatementSyntax(assignmentExpression.Name, fillParametersFunction.Type,
       fillParametersFunction.Mapping);
   }

   public static IEnumerable<StatementSyntax> FillStatementSyntax(string variableName, VariableType type,
     IEnumerable<Mapping> mappings)
   {
     if (variableName = null) throw new ArgumentNullException(nameof(variableName));
     if (type = null) throw new ArgumentNullException(nameof(type));
     if (mappings = null) throw new ArgumentNullException(nameof(mappings));

     var typeSyntax = Types.Syntax(type);

     var initialize = ObjectCreationExpression(Types.Syntax(type))
       .WithArgumentList(ArgumentList());

     var variable = VariableDeclarator(Identifier(variableName))
       .WithInitializer(EqualsValueClause(initialize));

     yield return LocalDeclarationStatement(
       VariableDeclaration(typeSyntax)
         .WithVariables(SingletonSeparatedList(variable)));

     foreach (var mapping in mappings)
     {
       var left = MemberAccessExpression(
         SyntaxKind.SimpleMemberAccessExpression,
         IdentifierName(variableName),
         IdentifierName(mapping.VariableName));

       var right = mapping.VariableSource = VariableSource.Code
         ? IdentifierName(mapping.VariableName)
         : mapping.VariableSource = VariableSource.Parameters
           ? (ExpressionSyntax)MemberAccessExpression(
             SyntaxKind.SimpleMemberAccessExpression,
             IdentifierName(LexyCodeConstants.ParameterVariable),
             IdentifierName(mapping.VariableName))
           : throw new InvalidOperationException("Invalid source: " + mapping.VariableSource);

       yield return ExpressionStatement(
         AssignmentExpression(SyntaxKind.SimpleAssignmentExpression, left, right));
     }
   }
}
