

internal static class GuardStatements {
   public static verifyNotNull(variable: string): StatementSyntax {
     return SyntaxFactory.IfStatement(
       SyntaxFactory.BinaryExpression(
         SyntaxKind.equalsExpression,
         SyntaxFactory.IdentifierName(variable),
         SyntaxFactory.LiteralExpression(SyntaxKind.NullLiteralExpression)),
       SyntaxFactory.ThrowStatement(
         SyntaxFactory.ObjectCreationExpression(
             SyntaxFactory.IdentifierName(`Error`))
           .WithArgumentList(
             SyntaxFactory.ArgumentList(
               SyntaxFactory.SingletonSeparatedList(
                 SyntaxFactory.Argument(
                   SyntaxFactory.InvocationExpression(
                       SyntaxFactory.IdentifierName(
                         SyntaxFactory.Identifier(
                           SyntaxFactory.TriviaList(),
                           SyntaxKind.NameOfKeyword,
                           `nameof`,
                           `nameof`,
                           SyntaxFactory.TriviaList())))
                     .WithArgumentList(
                       SyntaxFactory.ArgumentList(
                         SyntaxFactory.SingletonSeparatedList(
                           SyntaxFactory.Argument(
                             SyntaxFactory.IdentifierName(variable)))))))))));
   }
}
