namespace Lexy.Compiler.Parser;

public interface ITokenizer
{
   TokenizeResult Tokenize(Line line);
}
