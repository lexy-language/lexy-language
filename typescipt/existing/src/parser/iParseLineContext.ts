
export interface IParseLineContext {
   Line Line
   IParserLogger Logger

   TokenValidator ValidateTokens<T>();
   TokenValidator ValidateTokens(string name);
}
