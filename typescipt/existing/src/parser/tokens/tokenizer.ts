

export class Tokenizer extends ITokenizer {
   private readonly IDictionary<char, Func<TokenCharacter, ParsableToken>> knownTokens =
     new Dictionary<char, Func<TokenCharacter, ParsableToken>> {
       { TokenValues.CommentChar, value => new CommentToken(value) },

       { TokenValues.Quote, value => new QuotedLiteralToken(value) },

       { TokenValues.Assignment, value => new OperatorToken(value) },
       { TokenValues.Addition, value => new OperatorToken(value) },
       { TokenValues.Subtraction, value => new OperatorToken(value) },
       { TokenValues.Multiplication, value => new OperatorToken(value) },
       { TokenValues.Division, value => new OperatorToken(value) },
       { TokenValues.Modulus, value => new OperatorToken(value) },
       { TokenValues.ArgumentSeparator, value => new OperatorToken(value) },

       { TokenValues.OpenParentheses, value => new OperatorToken(value) },
       { TokenValues.CloseParentheses, value => new OperatorToken(value) },
       { TokenValues.OpenBrackets, value => new OperatorToken(value) },
       { TokenValues.CloseBrackets, value => new OperatorToken(value) },

       { TokenValues.GreaterThan, value => new OperatorToken(value) },
       { TokenValues.LessThan, value => new OperatorToken(value) },

       { TokenValues.NotEqualStart, value => new OperatorToken(value) },

       { TokenValues.And, value => new OperatorToken(value) },
       { TokenValues.Or, value => new OperatorToken(value) }
     };

   private readonly IDictionary<Func<char, bool>, Func<TokenCharacter, ParsableToken>> tokensValidators =
     new Dictionary<Func<char, bool>, Func<TokenCharacter, ParsableToken>> {
       { char.IsDigit, value => new NumberLiteralToken(value) },
       { char.IsLetter, value => new BuildLiteralToken(value) },
       { char.IsWhiteSpace, value => new WhitespaceToken(value) }
     };

   public tokenize(line: Line): TokenizeResult {
     if (line == null) throw new Error(nameof(line));

     let tokens = new Array<Token>();
     ParsableToken current = null;

     for (let index = 0; index < line.Content.Length; index++) {
       let value = line.Content[index];
       let tokenCharacter = new TokenCharacter(value, index);
       let valueProcessed = false;
       if (current != null) {
         let result = current.Parse(tokenCharacter);
         switch (result.Status) {
           case TokenStatus.InvalidToken: {
             return TokenizeResult.Failed(line.LineReference(index), result.ValidationError);
           }
           case TokenStatus.Finished: {
             tokens.Add(result.NewToken ?? current);
             current = null;
             valueProcessed = result.CharProcessed;
             break;
           }
           case TokenStatus.InProgress when result.NewToken != null: {
             let parsableToken = result.NewToken as ParsableToken;
             current = parsableToken ?? throw new Error(
               `New token can only be a parsable token when in progress`);
             break;
           }
         }
       }

       if (current == null && !valueProcessed) {
         let parsableTokenResult = StartToken(tokenCharacter, index, line);
         if (!parsableTokenResult.IsSuccess) {
           return TokenizeResult.Failed(parsableTokenResult.Reference, parsableTokenResult.ErrorMessage);
         }
         current = parsableTokenResult.Result;
       }
     }

     if (current != null) {
       let result = current.Finalize();
       if (result.Status != TokenStatus.Finished) {
         return TokenizeResult.Failed(line.LineEndReference(), $`Invalid token at end of line. {result.ValidationError}`);
       }

       tokens.Add(result.NewToken ?? current);
     }

     return TokenizeResult.Success(DiscardWhitespace(tokens));
   }

   private static discardWhitespace(tokens: Array<Token>): TokenList {
     let newTokens = new Array<Token>();
     foreach (let token in tokens) {
       if (token is CommentToken) break;
       if (!(token is WhitespaceToken)) newTokens.Add(token);
     }

     return new TokenList(newTokens.ToArray());
   }

   private startToken(character: TokenCharacter, index: number, line: Line): ParsableTokenResult {
     let value = character.Value;
     if (knownTokens.ContainsKey(value)) return ParsableTokenResult.Success(knownTokens[value](character));

     foreach (let validator in tokensValidators) {
       if (validator.Key(value)) {
         return ParsableTokenResult.Success(validator.Value(character));
       }
     }

     return ParsableTokenResult.Failed(line.LineReference(index), $`Invalid character at {index} '{value}'`) ;
   }
}
