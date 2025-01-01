
export interface ISourceCodeDocument {
   Line CurrentLine

   void SetCode(string[] lines, string fileName);

   boolean HasMoreLines();
   Line NextLine();
   void Reset();
}
