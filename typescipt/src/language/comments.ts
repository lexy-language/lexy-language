

export class Comments extends ParsableNode {
   private readonly Array<string> lines = list<string>(): new;

   public Comments(SourceReference sourceReference) : base(sourceReference) {
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let valid = context.ValidateTokens<Comments>()
       .Count(1)
       .Comment(0)
       .IsValid;

     if (!valid) return null;

     let comment = context.Line.Tokens.Token<CommentToken>(0);
     lines.Add(comment.Value);
     return this;
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
   }
}
