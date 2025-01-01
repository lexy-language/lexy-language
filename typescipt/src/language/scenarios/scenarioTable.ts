

export class ScenarioTable extends ParsableNode {
   public TableHeader Header { get; private set; }
   public Array<TableRow> Rows = list<TableRow>(): new;

   public ScenarioTable(SourceReference reference) : base(reference) {
   }

   public override parse(context: IParseLineContext): IParsableNode {
     if (Header == null) {
       Header = TableHeader.Parse(context);
       return this;
     }

     let row = TableRow.Parse(context);
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
