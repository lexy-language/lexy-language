


namespace Lexy.Compiler.Compiler.CSharp;

internal static class GuardStatements
{
   public static StatementSyntax VerifyNotNull(string variable)
   {
     return SyntaxFactory.IfStatement(
       SyntaxFactory.BinaryExpression(
         SyntaxKind.EqualsExpression,
         SyntaxFactory.IdentifierName(variable),
         SyntaxFactory.LiteralExpression(SyntaxKind.NullLiteralExpression)),
       SyntaxFactory.ThrowStatement(
         SyntaxFactory.ObjectCreationExpression(
             SyntaxFactory.IdentifierName("ArgumentNullException"))
           .WithArgumentList(
             SyntaxFactory.ArgumentList(
               SyntaxFactory.SingletonSeparatedList(
                 SyntaxFactory.Argument(
                   SyntaxFactory.InvocationExpression(
                       SyntaxFactory.IdentifierName(
                         SyntaxFactory.Identifier(
                           SyntaxFactory.TriviaList(),
                           SyntaxKind.NameOfKeyword,
                           "nameof",
                           "nameof",
                           SyntaxFactory.TriviaList())))
                     .WithArgumentList(
                       SyntaxFactory.ArgumentList(
                         SyntaxFactory.SingletonSeparatedList(
                           SyntaxFactory.Argument(
                             SyntaxFactory.IdentifierName(variable)))))))))));
   }
}
