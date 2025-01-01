

export class TableHeader extends Node {
   public Array<ColumnHeader> Columns

   private TableHeader(ColumnHeader[] columns, SourceReference reference) {
     super(reference);
     Columns = columns ?? throw new Error(nameof(columns));
   }

   public static parse(context: IParseLineContext): TableHeader {
     let index = 0;
     let validator = context.ValidateTokens<TableHeader>();

     if (!validator.Type<TableSeparatorToken>(index).IsValid) return null;

     let headers = new Array<ColumnHeader>();
     let tokens = context.line.tokens;
     while (++index < tokens.length) {
       if (!validator
           .Type<StringLiteralToken>(index)
           .Type<StringLiteralToken>(index + 1)
           .Type<TableSeparatorToken>(index + 2)
           .IsValid)
         return null;

       let typeName = tokens.tokenValue(index);
       let name = tokens.tokenValue(++index);
       let reference = context.line.TokenReference(index);

       let header = ColumnHeader.parse(name, typeName, reference);
       headers.Add(header);

       ++index;
     }

     return new TableHeader(headers.ToArray(), context.line.lineStartReference());
   }

   public override getChildren(): Array<INode> {
     return Columns;
   }

   protected override validate(context: IValidationContext): void {
   }

   public get(memberAccess: MemberAccessLiteral): ColumnHeader {
     let parts = memberAccess.Parts;
     if (parts.length < 2) return null;
     let name = parts[1];

     return Columns.FirstOrDefault(value => value.Name == name);
   }
}
