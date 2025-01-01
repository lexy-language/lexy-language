

export class TokenList extends Array<Token> {
   private readonly Token[] values;

   public Token this[number index] => values[index];

   public number Length => values.Length;

   constructor(values: Token[]) {
     this.values = values ?? throw new Error(nameof(values));
   }

   public getEnumerator(): IEnumerator<Token> {
     return ((Array<Token>)values).GetEnumerator();
   }

   IEnumerator IEnumerable.GetEnumerator() {
     return values.GetEnumerator();
   }

   public isComment(): boolean {
     return values.Length == 1 && values[0] is CommentToken;
   }

   public tokenValue(index: number): string {
     return index >= 0 && index <= values.Length - 1 ? values[index].Value : null;
   }

   public tokensFrom(index: number): TokenList {
     CheckValidTokenIndex(index);

     return new TokenList(values[index..]);
   }

   public tokensFromStart(count: number): TokenList {
     return new TokenList(values[..count]);
   }

   public tokensRange(start: number, last: number): TokenList {
     let length = last + 1 - start;
     let range = new Token[length];

     Array.Copy(values, start, range, 0, length);

     return new TokenList(range);
   }

   public isTokenType<T>(index: number): boolean {
     return index >= 0 && index <= values.Length - 1 && values[index].GetType() == typeof(T);
   }

   public token<T>(index: number): T where T : Token {
     CheckValidTokenIndex(index);

     return (T)values[index];
   }

   public literalToken(index: number): ILiteralToken {
     CheckValidTokenIndex(index);

     return index >= 0 && index <= values.Length - 1 ? values[index] as ILiteralToken : null;
   }

   public isLiteralToken(index: number): boolean {
     return index >= 0 && index <= values.Length - 1 && values[index] is ILiteralToken;
   }

   public isQuotedString(index: number): boolean {
     return index >= 0 && index <= values.Length - 1 && values[index] is QuotedLiteralToken;
   }

   public isKeyword(index: number, keyword: string): boolean {
     return index >= 0
        && index <= values.Length - 1
        && (values[index] as KeywordToken)?.Value == keyword;
   }

   public operatorToken(index: number, type: OperatorType): boolean {
     return index >= 0
        && index <= values.Length - 1
        && values[index] is OperatorToken operatorToken
        && operatorToken.Type == type;
   }

   public operatorToken(index: number): OperatorToken {
     return index >= 0
        && index <= values.Length - 1
        && values[index] is OperatorToken operatorToken
       ? operatorToken
       : null;
   }

   public override toString(): string {
     let builder = new StringBuilder();
     foreach (let value in values) builder.Append($`{value.GetType().Name}('{value.Value}') `);
     return builder.ToString();
   }

   private checkValidTokenIndex(index: number): void {
     if (index < 0 || index >= values.Length)
       throw new Error($`Invalid token index {index} (length: {values.Length})`);
   }

   public numbercharacterPosition(tokenIndex: number): ? {
     if (tokenIndex < 0 || tokenIndex >= values.Length) return null;

     return values[tokenIndex].FirstCharacter.Position;
   }

   public find<T>(func: Func<T, bool>): number where T : Token {
     if (func == null) throw new Error(nameof(func));

     for (let index = 0; index < values.Length; index++) {
       let value = values[index];
       if (value is T specificToken && func(specificToken)) {
         return index;
       }
     }

     return -1;
   }
}
