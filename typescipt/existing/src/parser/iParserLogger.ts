


namespace Lexy.Compiler.Parser;

public interface IParserLogger
{
   void LogInfo(string message);

   void Log(SourceReference reference, string message);
   void Fail(SourceReference reference, string message);
   void Fail(INode node, SourceReference reference, string message);

   void LogNodes(IEnumerable<INode> nodes);

   bool HasErrors();
   bool HasRootErrors();

   bool HasErrorMessage(string expectedError);

   public string FormatMessages();

   bool NodeHasErrors(IRootNode node);

   string[] ErrorMessages();
   string[] ErrorRootMessages();
   string[] ErrorNodeMessages(IRootNode node);

   void AssertNoErrors();

   void SetCurrentNode(IRootNode node);
   void Reset();
}
