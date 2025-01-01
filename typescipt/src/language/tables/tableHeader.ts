

export class TableHeader extends Node {
   public Array<ColumnHeader> Columns

   private TableHeader(ColumnHeader[] columns, SourceReference reference) : base(reference) {
     Columns = columns ?? throw new Error(nameof(columns));
   }

   public static parse(context: IParseLineContext): TableHeader {
     let index = 0;
     let validator = context.ValidateTokens<TableHeader>();

     if (!validator.Type<TableSeparatorToken>(index).IsValid) return null;

     let headers = new Array<ColumnHeader>();
     let tokens = context.Line.Tokens;
     while (++index < tokens.Length) {
       if (!validator
           .Type<StringLiteralToken>(index)
           .Type<StringLiteralToken>(index + 1)
           .Type<TableSeparatorToken>(index + 2)
           .IsValid)
         return null;

       let typeName = tokens.TokenValue(index);
       let name = tokens.TokenValue(++index);
       let reference = context.Line.TokenReference(index);

       let header = ColumnHeader.Parse(name, typeName, reference);
       headers.Add(header);

       ++index;
     }

     return new TableHeader(headers.ToArray(), context.Line.LineStartReference());
   }

   public override getChildren(): Array<INode> {
     return Columns;
   }

   protected override validate(context: IValidationContext): void {
   }

   public get(memberAccess: MemberAccessLiteral): ColumnHeader {
     let parts = memberAccess.Parts;
     if (parts.Length < 2) return null;
     let name = parts[1];

     return Columns.FirstOrDefault(value => value.Name == name);
   }
}
