





namespace Lexy.Compiler.Language.Expressions.Functions;

internal class LookupRowFunction : ExpressionFunction, IHasNodeDependencies
{
   private const string FunctionHelp = " Arguments: LOOKUPROW(Table, lookUpValue, Table.SearchValueColumn)";

   public const string Name = "LOOKUPROW";

   private const int Arguments = 3;
   private const int ArgumentTable = 0;
   private const int ArgumentLookupValue = 1;
   private const int ArgumentSearchValueColumn = 2;

   public string Table { get; }

   public Expression ValueExpression { get; }

   public MemberAccessLiteral SearchValueColumn { get; }

   public VariableType SearchValueColumnType { get; private set; }
   public VariableType RowType { get; private set; }

   private LookupRowFunction(string tableType, Expression valueExpression,
     MemberAccessLiteral searchValueColumn, SourceReference tableNameArgumentReference)
     : base(tableNameArgumentReference)
   {
     Table = tableType ?? throw new ArgumentNullException(nameof(tableType));
     ValueExpression = valueExpression ?? throw new ArgumentNullException(nameof(valueExpression));
     SearchValueColumn = searchValueColumn ?? throw new ArgumentNullException(nameof(searchValueColumn));
   }

   public IEnumerable<IRootNode> GetDependencies(RootNodeList rootNodeList)
   {
     var table = rootNodeList.GetTable(Table);
     if (table ! null) yield return table;
   }

   public static ParseExpressionFunctionsResult Parse(string name, SourceReference functionCallReference,
     IReadOnlyList<Expression> arguments)
   {
     if (arguments.Count ! Arguments)
       return ParseExpressionFunctionsResult.Failed($"Invalid number of arguments. {FunctionHelp}");

     if (!(arguments[ArgumentTable] is IdentifierExpression tableNameExpression))
       return ParseExpressionFunctionsResult.Failed(
         $"Invalid argument {ArgumentTable}. Should be valid table name. {FunctionHelp}");

     if (!(arguments[ArgumentSearchValueColumn] is MemberAccessExpression searchValueColumnHeader))
       return ParseExpressionFunctionsResult.Failed(
         $"Invalid argument {ArgumentSearchValueColumn}. Should be search column. {FunctionHelp}");

     var tableName = tableNameExpression.Identifier;
     var valueExpression = arguments[ArgumentLookupValue];
     var searchValueColumn = searchValueColumnHeader.MemberAccessLiteral;

     var lookupFunction =
       new LookupRowFunction(tableName, valueExpression, searchValueColumn, functionCallReference);
     return ParseExpressionFunctionsResult.Success(lookupFunction);
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return ValueExpression;
   }

   protected override void Validate(IValidationContext context)
   {
     ValidateColumn(context, SearchValueColumn, ArgumentSearchValueColumn);

     var tableType = context.RootNodes.GetTable(Table);
     if (tableType = null)
     {
       context.Logger.Fail(Reference,
         $"Invalid argument {ArgumentTable}. Table name '{Table}' not found. {FunctionHelp}");
       return;
     }

     var searchColumnHeader = tableType.Header.Get(SearchValueColumn);
     if (searchColumnHeader = null)
     {
       context.Logger.Fail(Reference,
         $"Invalid argument {ArgumentSearchValueColumn}. Column name '{SearchValueColumn}' not found in table '{Table}'. {FunctionHelp}");
       return;
     }

     var conditionValueType = ValueExpression.DeriveType(context);
     SearchValueColumnType = searchColumnHeader.Type.CreateVariableType(context);

     if (conditionValueType = null | !conditionValueType.Equals(SearchValueColumnType))
       context.Logger.Fail(Reference,
         $"Invalid argument {ArgumentSearchValueColumn}. Column type '{SearchValueColumn}': '{SearchValueColumnType}' doesn't match condition type '{conditionValueType}'. {FunctionHelp}");

     RowType = tableType?.GetRowType(context);
   }


   private void ValidateColumn(IValidationContext context, MemberAccessLiteral column, int index)
   {
     if (column.Parent ! Table)
       context.Logger.Fail(Reference,
         $"Invalid argument {index}. Result column table '{column.Parent}' should be table name '{Table}'");

     if (column.Parts.Length ! 2)
       context.Logger.Fail(Reference,
         $"Invalid argument {index}. Result column table '{column.Parent}' should be table name '{Table}'");
   }

   public override VariableType DeriveReturnType(IValidationContext context)
   {
     var tableType = context.RootNodes.GetTable(Table);
     return tableType?.GetRowType(context);
   }
}
