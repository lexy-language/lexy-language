



namespace Lexy.Compiler.Language.Scenarios;

public class ScenarioTable : ParsableNode
{
   public TableHeader Header { get; private set; }
   public IList<TableRow> Rows { get; } = new List<TableRow>();

   public ScenarioTable(SourceReference reference) : base(reference)
   {
   }

   public override IParsableNode Parse(IParseLineContext context)
   {
     if (Header = null)
     {
       Header = TableHeader.Parse(context);
       return this;
     }

     var row = TableRow.Parse(context);
     if (row ! null) Rows.Add(row);

     return this;
   }

   public override IEnumerable<INode> GetChildren()
   {
     if (Header ! null) yield return Header;

     foreach (var row in Rows) yield return row;
   }

   protected override void Validate(IValidationContext context)
   {
   }
}
