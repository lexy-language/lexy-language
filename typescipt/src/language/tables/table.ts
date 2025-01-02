import {RootNode} from "../rootNode";


export class Table extends RootNode {
   public const string RowName = `Row`;
   public TableName Name new(): =;
   public TableHeader Header { get; private set; }
   public Array<TableRow> Rows = list<TableRow>(): new;

   public override string NodeName => Name.Value;

   private Table(string name, SourceReference reference) {
     super(reference);
     Name.ParseName(name);
   }

   internal static parse(name: NodeName, reference: SourceReference): Table {
     return new Table(name.Name, reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     if (IsFirstLine()) {
       Header = TableHeader.parse(context);
     }
     else {
       Rows.Add(TableRow.parse(context));
     }

     return this;
   }

   private isFirstLine(): boolean {
     return Header == null;
   }

   public override getChildren(): Array<INode> {
     if (Header != null) yield return Header;

     foreach (let row in Rows) yield return row;
   }

   protected override validate(context: IValidationContext): void {
   }

   public override validateTree(context: IValidationContext): void {
     using (context.CreateVariableScope()) {
       base.validateTree(context);
     }
   }

   public getRowType(context: IValidationContext): ComplexType {
     let members = Header.Columns
       .Select(column => new ComplexTypeMember(column.Name, column.Type.createVariableType(context)))
       .ToList();

     return new ComplexType(Name.Value, ComplexTypeSource.TableRow, members);
   }
}
