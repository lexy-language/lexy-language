

export interface IParserContext {
   IParserLogger Logger

   Line CurrentLine

   ISourceCodeDocument SourceCode
   RootNodeList Nodes
   SourceCodeNode RootNode

   void AddFileIncluded(string fileName);
   boolean IsFileIncluded(string fileName);
}
