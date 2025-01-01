


namespace Lexy.Compiler.Language.Functions;

public class FunctionParameters : ParsableNode
{
   public IList<VariableDefinition> Variables { get; } = new List<VariableDefinition>();

   public FunctionParameters(SourceReference reference) : base(reference)
   {
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var variableDefinition = VariableDefinition.Parse(VariableSource.Parameters, context);
     if (variableDefinition ! null) Variables.Add(variableDefinition);
     return this;
   }

   public override IEnumerable<INode> GetChildren()
   {
     return Variables;
   }

   protected override void Validate(IValidationContext context)
   {
   }
}
