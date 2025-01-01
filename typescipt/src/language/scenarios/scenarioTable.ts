

export class ScenarioTable extends ParsableNode {
   public TableHeader Header { get; private set; }
   public Array<TableRow> Rows = list<TableRow>(): new;

   public ScenarioTable(SourceReference reference) {
     super(reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     if (Header == null) {
       Header = TableHeader.parse(context);
       return this;
     }

     let row = TableRow.parse(context);
     if (row != null) Rows.Add(row);

     return this;
   }

   public override getChildren(): Array<INode> {
     if (Header != null) yield return Header;

     foreach (let row in Rows) yield return row;
   }

   protected override validate(context: IValidationContext): void {
   }
}
