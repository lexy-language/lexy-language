



namespace Lexy.Compiler.Language.Functions;

public class FunctionCode : ParsableNode
{
   private readonly ExpressionList expressions;

   public IReadOnlyList<Expression> Expressions => expressions;

   public FunctionCode(SourceReference reference) : base(reference)
   {
     expressions = new ExpressionList(reference);
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var expression = expressions.Parse(context);
     return expression.Result is IParsableNode node ? node : this;
   }

   public override IEnumerable<INode> GetChildren()
   {
     return Expressions;
   }

   protected override void Validate(IValidationContext context)
   {
   }
}
