



namespace Lexy.Compiler.Language.Scenarios;

public class ScenarioExpectRootErrors : ParsableNode
{
   private readonly IList<string> messages = new List<string>();

   public IEnumerable<string> Messages => messages;

   public bool HasValues => messages.Count > 0;

   public ScenarioExpectRootErrors(SourceReference reference) : base(reference)
   {
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var line = context.Line;
     var valid = context.ValidateTokens<ScenarioExpectError>()
       .Count(1)
       .QuotedString(0)
       .IsValid;

     if (!valid) return this;

     messages.Add(line.Tokens.Token<QuotedLiteralToken>(0).Value);
     return this;
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield break;
   }

   protected override void Validate(IValidationContext context)
   {
   }
}
