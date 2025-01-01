
export interface ILexyParser {
   ParserResult ParseFile(string fileName, boolean throwException = true);
   ParserResult Parse(string[] code, string fileName, boolean throwException = true);
}
