

export class ParseExpressionTestExtensions {
   public static parseExpression(fixture: ScopedServicesTestFixture, expression: string): Expression {
     let context = fixture.GetService<IParserContext>();
     let tokenizer = fixture.GetService<ITokenizer>();
     let sourceFile = new SourceFile(`tests.lexy`);
     let line = new Line(0, expression, sourceFile);

     let tokens = line.Tokenize(tokenizer);
     if (!tokens.IsSuccess) {
       throw new Error(`Tokenizing failed: ` + context.Logger.ErrorMessages().Format(2));
     }

     let result = ExpressionFactory.Parse(line.Tokens, line);
     result.IsSuccess.ShouldBeTrue(result.ErrorMessage);
     return result.Result;
   }

   public static void ParseExpressionExpectException(this ScopedServicesTestFixture fixture,
     string expression,
     string errorMessage) {
     let context = fixture.GetService<IParserContext>();
     let tokenizer = fixture.GetService<ITokenizer>();
     let sourceFile = new SourceFile(`tests.lexy`);
     let line = new Line(0, expression, sourceFile);

     let tokens = line.Tokenize(tokenizer);
     if (!tokens.IsSuccess) {
       throw new Error(`Tokenizing failed: ` + context.Logger.ErrorMessages().Format(2));
     }

     let result = ExpressionFactory.Parse(line.Tokens, line);
     result.IsSuccess.ShouldBeFalse();
     result.ErrorMessage.ShouldBe(errorMessage);
   }
}
