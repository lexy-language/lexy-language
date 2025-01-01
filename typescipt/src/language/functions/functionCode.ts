

export class FunctionCode extends ParsableNode {
   private readonly ExpressionList expressions;

   public IReadOnlyArray<Expression> Expressions => expressions;

   public FunctionCode(SourceReference reference) : base(reference) {
     expressions = new ExpressionList(reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let expression = expressions.Parse(context);
     return expression.Result is IParsableNode node ? node : this;
   }

   public override getChildren(): Array<INode> {
     return Expressions;
   }

   protected override validate(context: IValidationContext): void {
   }
}
