

export class ParseExpressionTestExtensions {
   public static parseExpression(fixture: ScopedServicesTestFixture, expression: string): Expression {
     let context = fixture.GetService<IParserContext>();
     let tokenizer = fixture.GetService<ITokenizer>();
     let sourceFile = new SourceFile(`tests.lexy`);
     let line = new Line(0, expression, sourceFile);

     let tokens = line.Tokenize(tokenizer);
     if (tokens.state != 'success') {
       throw new Error(`Tokenizing failed: ` + context.logger.errorMessages().Format(2));
     }

     let result = ExpressionFactory.parse(line.tokens, line);
     result.IsSuccess.ShouldBeTrue(result.errorMessage);
     return result.result;
   }

   public static void ParseExpressionExpectException(this ScopedServicesTestFixture fixture,
     string expression,
     string errorMessage) {
     let context = fixture.GetService<IParserContext>();
     let tokenizer = fixture.GetService<ITokenizer>();
     let sourceFile = new SourceFile(`tests.lexy`);
     let line = new Line(0, expression, sourceFile);

     let tokens = line.Tokenize(tokenizer);
     if (tokens.state != 'success') {
       throw new Error(`Tokenizing failed: ` + context.logger.errorMessages().Format(2));
     }

     let result = ExpressionFactory.parse(line.tokens, line);
     result.IsSuccess.ShouldBeFalse();
     result.errorMessage.ShouldBe(errorMessage);
   }
}
