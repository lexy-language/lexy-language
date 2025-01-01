

export class TableRow extends Node {
   public Array<Expression> Values

   private TableRow(Expression[] values, SourceReference reference) {
     super(reference);
     Values = values ?? throw new Error(nameof(values));
   }

   public static parse(context: IParseLineContext): TableRow {
     let index = 0;
     let validator = context.ValidateTokens<TableRow>();

     if (!validator.Type<TableSeparatorToken>(index).IsValid) return null;

     let tokens = new Array<Expression>();
     let currentLineTokens = context.line.tokens;
     while (++index < currentLineTokens.length) {
       let valid = !validator
         .IsLiteralToken(index)
         .Type<TableSeparatorToken>(index + 1)
         .IsValid;

       if (valid) return null;

       let reference = context.line.TokenReference(index);
       let token = currentLineTokens.Token<Token>(index++);
       let expression = ExpressionFactory.parse(new TokenList(new[] { token }), context.line);
       if (context.failed(expression, reference)) return null;

       tokens.Add(expression.result);
     }

     return new TableRow(tokens.ToArray(), context.line.lineStartReference());
   }

   public override getChildren(): Array<INode> {
     return Values.ToList();
   }

   protected override validate(context: IValidationContext): void {
   }
}
