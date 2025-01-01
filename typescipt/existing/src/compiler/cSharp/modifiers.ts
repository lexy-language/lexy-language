



namespace Lexy.Compiler.Compiler.CSharp;

internal static class Modifiers
{
   private static SyntaxToken PublicToken()
   {
     return Token(SyntaxKind.PublicKeyword);
   }

   private static SyntaxToken PrivateToken()
   {
     return Token(SyntaxKind.PrivateKeyword);
   }

   private static SyntaxToken StaticToken()
   {
     return Token(SyntaxKind.StaticKeyword);
   }

   public static SyntaxTokenList Public()
   {
     return TokenList(PublicToken());
   }

   public static SyntaxTokenList Static()
   {
     return TokenList(StaticToken());
   }

   public static SyntaxTokenList Private()
   {
     return TokenList(PrivateToken());
   }

   public static SyntaxTokenList PrivateStatic()
   {
     return TokenList(PrivateToken(), StaticToken());
   }

   public static SyntaxTokenList PublicStatic()
   {
     return TokenList(PublicToken(), StaticToken());
   }
}
