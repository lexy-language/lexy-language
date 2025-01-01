

export interface IParserLogger {
   void LogInfo(string message);

   void Log(SourceReference reference, string message);
   void Fail(SourceReference reference, string message);
   void Fail(INode node, SourceReference reference, string message);

   void LogNodes(Array<INode> nodes);

   boolean HasErrors();
   boolean HasRootErrors();

   boolean HasErrorMessage(string expectedError);

   public formatMessages(): string;

   boolean NodeHasErrors(IRootNode node);

   string[] ErrorMessages();
   string[] ErrorRootMessages();
   string[] ErrorNodeMessages(IRootNode node);

   void AssertNoErrors();

   void SetCurrentNode(IRootNode node);
   void Reset();
}
