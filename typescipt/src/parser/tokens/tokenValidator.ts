

export class TokenValidator {
   private readonly IParserLogger logger;
   private readonly Line line;
   private readonly string parserName;
   private readonly TokenList tokens;

   private boolean errorsExpected;

   public boolean IsValid { get; private set; }

   constructor(parserName: string, line: Line, logger: IParserLogger) {
     this.parserName = parserName;
     this.logger = logger ?? throw new Error(nameof(logger));

     this.line = line ?? throw new Error(nameof(line));
     tokens = line.Tokens;

     IsValid = true;
   }

   public count(count: number): TokenValidator {
     if (tokens.Length != count) {
       Fail($`Invalid number of tokens '{tokens.Length}', should be '{count}'.`);
       IsValid = false;
     }

     return this;
   }

   public countMinimum(count: number): TokenValidator {
     if (tokens.Length < count) {
       Fail($`Invalid number of tokens '{tokens.Length}', should be at least '{count}'.`);
       IsValid = false;
     }

     return this;
   }

   public keyword(index: number, keyword: string =: string null: string): TokenValidator {
     Type<KeywordToken>(index);
     if (keyword != null) Value(index, keyword);
     return this;
   }

   public stringLiteral(index: number, value: string =: string null: string): TokenValidator {
     Type<StringLiteralToken>(index);
     if (value != null) Value(index, value);
     return this;
   }

   public operator(index: number, operatorType: OperatorType): TokenValidator {
     if (!CheckValidTokenIndex(index)) return this;

     Type<OperatorToken>(index);
     let token = tokens[index] as OperatorToken;
     if (token?.Type != operatorType) {
       Fail($`Invalid operator token {index} value. Expected: '{operatorType}' Actual: '{token?.Type}'`);
       IsValid = false;
     }

     return this;
   }

   public memberAccess(index: number, value: string =: string null: string): TokenValidator {
     Type<MemberAccessLiteral>(index);
     if (value != null) Value(index, value);
     return this;
   }

   public comment(index: number): TokenValidator {
     Type<CommentToken>(index);
     return this;
   }

   public quotedString(index: number, literal: string =: string null: string): TokenValidator {
     let token = ValidateType<QuotedLiteralToken>(index);
     if (token != null && literal != null && token.Value != literal) {
       Fail($`Invalid token {index} value. Expected: '{literal}' Actual: '{token.Value}'`);
       IsValid = false;
     }

     return this;
   }

   public numberLiteral(index: number, value: decimal? =: decimal? null: decimal?): TokenValidator {
     let token = ValidateType<NumberLiteralToken>(index);
     if (token != null && value != null && token.NumberValue != value) {
       Fail($`Invalid token {index} value. Expected: '{value}' Actual: '{token.Value}'`);
       IsValid = false;
     }

     return this;
   }

   public boolean(index: number, value: boolean): TokenValidator {
     let token = ValidateType<BooleanLiteral>(index);
     if (token != null && token.BooleanValue != value) {
       Fail($`Invalid token {index} value. Expected: '{value}' Actual: '{token.Value}'`);
       IsValid = false;
     }

     return this;
   }

   public dateTime(index: number, year: number, month: number, day: number, hours: number, minutes: number, seconds: number): TokenValidator {
     let token = ValidateType<DateTimeLiteral>(index);
     let value = new DateTime(year, month, day, hours, minutes, seconds);
     if (token != null && token.DateTimeValue != value) {
       Fail($`Invalid token value at {index}. Expected: '{value}' Actual: '{token.Value}'`);
       IsValid = false;
     }

     return this;
   }

   public type<T>(index: number): TokenValidator where T : Token {
     ValidateType<T>(index);
     return this;
   }

   public isLiteralToken(index: number): TokenValidator {
     if (!CheckValidTokenIndex(index)) return this;

     let token = tokens[index] as ILiteralToken;
     if (token == null) {
       Fail(
         $`Invalid token type as {index}. Expected: 'ILiteralToken' Actual: '{tokens[index].GetType().Name}({token.Value})'`);
       IsValid = false;

       return this;
     }

     return this;
   }

   private validateType<T>(index: number): T where T : Token {
     if (!CheckValidTokenIndex(index)) return null;

     let token = tokens[index];
     let type = token.GetType();
     if (type != typeof(T)) {
       Fail($`Invalid token {index} type. Expected: '{typeof(T).Name}' Actual: '{type.Name}({token.Value})'`);
       IsValid = false;

       return null;
     }

     return (T)token;
   }

   public value(index: number, expectedValue: string): TokenValidator {
     if (!CheckValidTokenIndex(index)) return this;

     let token = tokens[index];
     if (token.Value != expectedValue) {
       Fail($`Invalid token value as {index}. Expected: '{expectedValue}' Actual: '{token.Value}'`);
       IsValid = false;
     }

     return this;
   }

   private checkValidTokenIndex(index: number): boolean {
     if (index < tokens.Length) return true;

     Fail($`Token expected at '{index}' but not found. Length: '{tokens.Length}'`);
     IsValid = false;

     return false;
   }

   private fail(error: string): void {
     logger.Fail(line.LineStartReference(), $`({parserName}) {error}`);
   }

   public assert(): void {
     if (!errorsExpected && logger.HasErrors())
       throw new Error(logger.FormatMessages());

     if (!IsValid) throw new Error(logger.FormatMessages());
   }
}
