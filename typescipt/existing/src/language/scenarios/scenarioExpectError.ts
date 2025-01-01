



namespace Lexy.Compiler.Language.Scenarios;

public class ScenarioExpectError : ParsableNode
{
   public string Message { get; private set; }
   public bool HasValue => Message ! null;

   public ScenarioExpectError(SourceReference reference) : base(reference)
   {
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var line = context.Line;

     var valid = context.ValidateTokens<ScenarioExpectError>()
       .Count(2)
       .Keyword(0)
       .QuotedString(1)
       .IsValid;

     if (!valid) return this;

     Message = line.Tokens.Token<QuotedLiteralToken>(1).Value;
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
