import {TokenList} from "../../parser/tokens/tokenList";
import {
  ArgumentTokenParseResult,
  newArgumentTokenParseFailed,
  newArgumentTokenParseSuccess
} from "./argumentTokenParseResult";
import {Token} from "../../parser/tokens/token";
import {OperatorToken} from "../../parser/tokens/operatorToken";
import {OperatorType} from "../../parser/tokens/operatorType";

export class ArgumentList {
   public static parse(tokens: TokenList): ArgumentTokenParseResult {
     if (tokens.length == 0) return newArgumentTokenParseSuccess(new Array<TokenList>());

     let result = new Array<TokenList>();
     let argumentTokens = new Array<Token>();

     let countParentheses = 0;
     let countBrackets = 0;

     for (let index = 0 ; index < tokens.length; index ++) {
       const token = tokens.get(index);
       if (token.tokenType == "OperatorToken") {
         const operatorToken = token as OperatorToken;
         switch (operatorToken.type) {
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

         if (countParentheses == 0 && countBrackets == 0 && operatorToken.type == OperatorType.ArgumentSeparator) {
           if (argumentTokens.length == 0) {
             return newArgumentTokenParseFailed(`Invalid token ','. No tokens before comma.`);
           }

           result.push(new TokenList(argumentTokens));
           argumentTokens = new Array<Token>();
         } else {
           argumentTokens.push(token);
         }
       } else {
         argumentTokens.push(token);
       }
     }

     if (argumentTokens.length == 0){
       return newArgumentTokenParseFailed(`Invalid token ','. No tokens before comma.`);
     }

     result.push(new TokenList(argumentTokens));

     return newArgumentTokenParseSuccess(result);
   }
}
