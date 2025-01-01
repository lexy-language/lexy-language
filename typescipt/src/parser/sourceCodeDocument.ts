

export class SourceCodeDocument extends ISourceCodeDocument {
   private Line[] code;
   private number index;
   private SourceFile file;

   public Line CurrentLine { get; private set; }

   public setCode(lines: string[], fileName: string): void {
     index = -1;
     file = new SourceFile(fileName);
     code = lines.Select((line, index) => new Line(index, line, file)).ToArray();
   }

   public hasMoreLines(): boolean {
     return index < code.Length - 1;
   }

   public nextLine(): Line {
     if (index >= code.Length) throw new Error(`No more lines`);

     CurrentLine = code[++index];
     return CurrentLine;
   }

   public reset(): void {
     CurrentLine = null;
   }
}
