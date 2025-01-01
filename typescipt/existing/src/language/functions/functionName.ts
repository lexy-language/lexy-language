




namespace Lexy.Compiler.Language.Functions;

public class FunctionName : Node
{
   public string Value { get; private set; }

   public FunctionName(SourceReference reference) : base(reference)
   {
   }

   public void ParseName(string name)
   {
     Value = name ?? throw new ArgumentNullException(nameof(name));
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield break;
   }

   protected override void Validate(IValidationContext context)
   {
     if (string.IsNullOrEmpty(Value))
       context.Logger.Fail(Reference, $"Invalid function name: '{Value}'. Name should not be empty.");
     if (!SyntaxFacts.IsValidIdentifier(Value)) context.Logger.Fail(Reference, $"Invalid function name: '{Value}'.");
   }
}
