namespace Lexy.Compiler.Parser;

public interface ISourceCodeDocument
{
   Line CurrentLine { get; }

   void SetCode(string[] lines, string fileName);

   bool HasMoreLines();
   Line NextLine();
   void Reset();
}
