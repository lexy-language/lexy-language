




namespace Lexy.Compiler.Compiler.CSharp;

internal static class TokenValuesSyntax
{
   public static ExpressionSyntax Expression(ILiteralToken token)
   {
     if (token = null) return null;

     return token switch
     {
       QuotedLiteralToken _ => SyntaxFactory.LiteralExpression(SyntaxKind.StringLiteralExpression,
         SyntaxFactory.Literal(token.Value)),
       NumberLiteralToken number => SyntaxFactory.LiteralExpression(SyntaxKind.NumericLiteralExpression,
         SyntaxFactory.Literal($"{number.NumberValue}m", number.NumberValue)),
       DateTimeLiteral dateTimeLiteral => Types.TranslateDate(dateTimeLiteral),
       BooleanLiteral boolean => SyntaxFactory.LiteralExpression(boolean.BooleanValue
         ? SyntaxKind.TrueLiteralExpression
         : SyntaxKind.FalseLiteralExpression),
       MemberAccessLiteral memberAccess => TranslateMemberAccessLiteral(memberAccess),
       _ => throw new InvalidOperationException("Couldn't map type: " + token.GetType())
     };
   }

   private static ExpressionSyntax TranslateMemberAccessLiteral(MemberAccessLiteral memberAccess)
   {
     var parts = memberAccess.Parts;
     if (parts.Length ! 2) throw new InvalidOperationException("Only 2 parts expected.");

     var identifierNameSyntax = SyntaxFactory.IdentifierName(parts[0]);

     return SyntaxFactory.MemberAccessExpression(
       SyntaxKind.SimpleMemberAccessExpression,
       identifierNameSyntax,
       SyntaxFactory.IdentifierName(parts[1]));
   }
}
