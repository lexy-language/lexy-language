

internal static class Modifiers {
   private static publicToken(): SyntaxToken {
     return Token(SyntaxKind.PublicKeyword);
   }

   private static privateToken(): SyntaxToken {
     return Token(SyntaxKind.PrivateKeyword);
   }

   private static staticToken(): SyntaxToken {
     return Token(SyntaxKind.StaticKeyword);
   }

   public static public(): SyntaxTokenList {
     return TokenList(PublicToken());
   }

   public static static(): SyntaxTokenList {
     return TokenList(StaticToken());
   }

   public static private(): SyntaxTokenList {
     return TokenList(PrivateToken());
   }

   public static privateStatic(): SyntaxTokenList {
     return TokenList(PrivateToken(), StaticToken());
   }

   public static publicStatic(): SyntaxTokenList {
     return TokenList(PublicToken(), StaticToken());
   }
}
