

export class TableRow extends Node {
   public Array<Expression> Values

   private TableRow(Expression[] values, SourceReference reference) : base(reference) {
     Values = values ?? throw new Error(nameof(values));
   }

   public static parse(context: IParseLineContext): TableRow {
     let index = 0;
     let validator = context.ValidateTokens<TableRow>();

     if (!validator.Type<TableSeparatorToken>(index).IsValid) return null;

     let tokens = new Array<Expression>();
     let currentLineTokens = context.Line.Tokens;
     while (++index < currentLineTokens.Length) {
       let valid = !validator
         .IsLiteralToken(index)
         .Type<TableSeparatorToken>(index + 1)
         .IsValid;

       if (valid) return null;

       let reference = context.Line.TokenReference(index);
       let token = currentLineTokens.Token<Token>(index++);
       let expression = ExpressionFactory.Parse(new TokenList(new[] { token }), context.Line);
       if (context.Failed(expression, reference)) return null;

       tokens.Add(expression.Result);
     }

     return new TableRow(tokens.ToArray(), context.Line.LineStartReference());
   }

   public override getChildren(): Array<INode> {
     return Values.ToList();
   }

   protected override validate(context: IValidationContext): void {
   }
}
