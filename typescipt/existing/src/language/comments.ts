



namespace Lexy.Compiler.Language;

public class Comments : ParsableNode
{
   private readonly IList<string> lines = new List<string>();

   public Comments(SourceReference sourceReference) : base(sourceReference)
   {
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     var valid = context.ValidateTokens<Comments>()
       .Count(1)
       .Comment(0)
       .IsValid;

     if (!valid) return null;

     var comment = context.Line.Tokens.Token<CommentToken>(0);
     lines.Add(comment.Value);
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
