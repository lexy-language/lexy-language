



namespace Lexy.Compiler.Language.Types;

public sealed class ImplicitVariableDeclaration : VariableDeclarationType
{
   public VariableType VariableType { get; private set; }

   public ImplicitVariableDeclaration(SourceReference reference) : base(reference)
   {
   }

   public override VariableType CreateVariableType(IValidationContext context)
   {
     return VariableType ??
        throw new InvalidOperationException("Not supported. Nodes should be Validated first.");
   }

   public void Define(VariableType variableType)
   {
     VariableType = variableType;
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield break;
   }

   protected override void Validate(IValidationContext context)
   {
   }
}
