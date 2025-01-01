

export class TokenizerTestExtensions {
   public static tokenize(serviceProvider: IServiceProvider, value: string): TokenValidator {
     if (serviceProvider == null) throw new Error(nameof(serviceProvider));

     let tokenizer = new Lexy.Compiler.Parser.Tokenizer();
     let file = new SourceFile(`tests.lexy`);
     let line = new Line(0, value, file);
     let tokens = line.Tokenize(tokenizer);
     if (!tokens.IsSuccess) {
       throw new Error(`Process line failed: ` + tokens.ErrorMessage);
     }

     let logger = serviceProvider.GetRequiredService<IParserLogger>();

     let parseLineContext = new ParseLineContext(line, logger);
     let methodInfo = new StackTrace()?.GetFrame(1)?.GetMethod();

     return parseLineContext.ValidateTokens(methodInfo?.ReflectedType?.Name);
   }

   public static tokenizeExpectError(serviceProvider: IServiceProvider, value: string): TokenizeResult {
     if (serviceProvider == null) throw new Error(nameof(serviceProvider));

     let code = new[] { value };

     let codeContext = serviceProvider.GetRequiredService<ISourceCodeDocument>();
     codeContext.SetCode(code, `tests.lexy`);

     let tokenizer = serviceProvider.GetRequiredService<ITokenizer>();

     let line = codeContext.NextLine();
     let tokenizeResult = line.Tokenize(tokenizer);
     if (tokenizeResult.IsSuccess) {
       throw new Error( `Process didn't fail, but should have: ` + tokenizeResult.ErrorMessage);
     }

     return tokenizeResult;
   }
}
