

export class ArgumentList {
   public static parse(tokens: TokenList): ArgumentTokenParseResult {
     if (tokens == null) throw new Error(nameof(tokens));
     if (tokens.Length == 0) return ArgumentTokenParseResult.Success();

     let result = new Array<TokenArray>();
     let argumentTokens = new Array<Token>();

     let countParentheses = 0;
     let countBrackets = 0;
     foreach (let token in tokens)
       if (token is OperatorToken operatorToken) {
         switch (operatorToken.Type) {
           case OperatorType.OpenParentheses:
             countParentheses++;
             break;
           case OperatorType.CloseParentheses:
             countParentheses--;
             break;
           case OperatorType.OpenBrackets:
             countBrackets++;
             break;
           case OperatorType.CloseBrackets:
             countBrackets--;
             break;
         }

         if (countParentheses == 0 && countBrackets == 0 && operatorToken.Type == OperatorType.ArgumentSeparator) {
           if (argumentTokens.Count == 0)
             return ArgumentTokenParseResult.Failed(@`Invalid token ','. No tokens before comma.`);

           result.Add(new TokenList(argumentTokens.ToArray()));
           argumentTokens = new Array<Token>();
         }
         else {
           argumentTokens.Add(token);
         }
       }
       else {
         argumentTokens.Add(token);
       }

     if (argumentTokens.Count == 0)
       return ArgumentTokenParseResult.Failed(@`Invalid token ','. No tokens before comma.`);

     result.Add(new TokenList(argumentTokens.ToArray()));

     return ArgumentTokenParseResult.Success(result);
   }
}
