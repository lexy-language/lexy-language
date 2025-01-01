

export class ExpressionList extends Node, IReadOnlyArray<Expression> {
   private readonly Array<Expression> values new(): =;

   public number Count => values.Count;
   public Expression this[number index] => values[index];

   public ExpressionList(SourceReference reference) : base(reference) {
   }

   public getEnumerator(): IEnumerator<Expression> {
     return values.GetEnumerator();
   }

   IEnumerator IEnumerable.GetEnumerator() {
     return GetEnumerator();
   }

   public override getChildren(): Array<INode> {
     return values;
   }

   protected override validate(context: IValidationContext): void {
   }

   public override validateTree(context: IValidationContext): void {
     using (context.CreateVariableScope()) {
       base.ValidateTree(context);
     }
   }

   public parse(context: IParseLineContext): ParseExpressionResult {
     let line = context.Line;
     let expression = ExpressionFactory.Parse(line.Tokens, line);
     if (!expression.IsSuccess) {
       context.Logger.Fail(line.LineStartReference(), expression.ErrorMessage);
       return expression;
     }

     Add(expression.Result, context);
     return expression;
   }

   private add(expression: Expression, context: IParseLineContext): void {
     if (expression is IDependantExpression childExpression)
       childExpression.LinkPreviousExpression(values.LastOrDefault(), context);
     else
       values.Add(expression);
   }
}
