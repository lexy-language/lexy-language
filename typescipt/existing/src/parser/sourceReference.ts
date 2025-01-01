

namespace Lexy.Compiler.Parser;

public class SourceReference
{
   private readonly int? characterNumber;
   private readonly int? lineNumber;

   public SourceFile File { get; }

   public SourceReference(SourceFile file, int? lineNumber, int? characterNumber)
   {
     File = file ?? throw new ArgumentNullException(nameof(file));
     this.characterNumber = characterNumber;
     this.lineNumber = lineNumber;
   }

   public override string ToString()
   {
     return $"{File.FileName}({lineNumber}, {characterNumber})";
   }
}
