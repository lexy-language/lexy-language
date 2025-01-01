

export class SourceReference {
   private readonly number? characterNumber;
   private readonly number? lineNumber;

   public SourceFile File

   constructor(file: SourceFile, lineNumber: int?, characterNumber: int?) {
     File = file ?? throw new Error(nameof(file));
     this.characterNumber = characterNumber;
     this.lineNumber = lineNumber;
   }

   public override toString(): string {
     return $`{File.FileName}({lineNumber}, {characterNumber})`;
   }
}
