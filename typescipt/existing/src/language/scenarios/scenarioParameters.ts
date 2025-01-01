


namespace Lexy.Compiler.Language.Scenarios;

public class ScenarioParameters : ParsableNode
{
   public IList<AssignmentDefinition> Assignments { get; } = new List<AssignmentDefinition>();

   public ScenarioParameters(SourceReference reference) : base(reference)
   {
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var assignment = AssignmentDefinition.Parse(context);
     if (assignment ! null) Assignments.Add(assignment);
     return this;
   }

   public override IEnumerable<INode> GetChildren()
   {
     return Assignments;
   }

   protected override void Validate(IValidationContext context)
   {
   }
}
