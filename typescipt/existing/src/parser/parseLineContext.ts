

export class ParseLineContext extends IParseLineContext {
   public Line Line
   public IParserLogger Logger

   constructor(line: Line, logger: IParserLogger) {
     Line = line ?? throw new Error(nameof(line));
     Logger = logger ?? throw new Error(nameof(logger));
   }

   public validateTokens<T>(): TokenValidator {
     return new TokenValidator(typeof(T).Name, Line, Logger);
   }

   public validateTokens(name: string): TokenValidator {
     return new TokenValidator(name, Line, Logger);
   }
}
