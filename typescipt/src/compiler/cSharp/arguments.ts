

internal static class Arguments {
   public static numeric(value: number): SyntaxNode {
     return Argument(
       LiteralExpression(
         SyntaxKind.NumericLiteralExpression,
         Literal(value)));
   }

   public static string(value: string): SyntaxNode {
     return Argument(
       LiteralExpression(
         SyntaxKind.StringLiteralExpression,
         Literal(value)));
   }

   public static memberAccess(value: string, member: string): SyntaxNode {
     return Argument(
       MemberAccessExpression(
         SyntaxKind.SimpleMemberAccessExpression,
         IdentifierName(value),
         IdentifierName(member)));
   }

   public static memberAccessLambda(parameter: string, member: string): SyntaxNode {
     return Argument(SimpleLambdaExpression(Parameter(Identifier(parameter)))
       .WithExpressionBody(
         MemberAccessExpression(
           SyntaxKind.SimpleMemberAccessExpression,
           IdentifierName(parameter),
           IdentifierName(member))));
   }
}
