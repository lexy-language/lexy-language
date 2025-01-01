



namespace Lexy.Compiler.Language.Scenarios;

public class ScenarioName : Node
{
   public string Value { get; private set; } = Guid.NewGuid().ToString("D");

   public ScenarioName(SourceReference reference) : base(reference)
   {
   }

   public void ParseName(string parameter)
   {
     Value = parameter;
   }

   public override string ToString()
   {
     return Value;
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield break;
   }

   protected override void Validate(IValidationContext context)
   {
   }
}
