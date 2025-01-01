





namespace Lexy.Compiler.Language.Expressions.Functions;

internal class LookupFunction : ExpressionFunction, IHasNodeDependencies
{
   private const string FunctionHelp =
     "Arguments: LOOKUP(Table, lookUpValue, Table.SearchValueColumn, Table.ResultColumn)";

   public const string Name = "LOOKUP";

   private const int Arguments = 4;
   private const int ArgumentTable = 0;
   private const int ArgumentLookupValue = 1;
   private const int ArgumentSearchValueColumn = 2;
   private const int ArgumentResultColumn = 3;

   public string Table { get; }

   public Expression ValueExpression { get; }

   public MemberAccessLiteral ResultColumn { get; }
   public MemberAccessLiteral SearchValueColumn { get; }

   public VariableType ResultColumnType { get; private set; }
   public VariableType SearchValueColumnType { get; private set; }

   private LookupFunction(string tableType, Expression valueExpression,
     MemberAccessLiteral resultColumn, MemberAccessLiteral searchValueColumn,
     SourceReference tableNameArgumentReference)
     : base(tableNameArgumentReference)
   {
     Table = tableType ?? throw new ArgumentNullException(nameof(tableType));
     ValueExpression = valueExpression ?? throw new ArgumentNullException(nameof(valueExpression));
     ResultColumn = resultColumn ?? throw new ArgumentNullException(nameof(resultColumn));
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

     if (!(arguments[ArgumentResultColumn] is MemberAccessExpression resultColumnExpression))
       return ParseExpressionFunctionsResult.Failed(
         $"Invalid argument {ArgumentResultColumn}. Should be result column. {FunctionHelp}");

     var tableName = tableNameExpression.Identifier;
     var valueExpression = arguments[ArgumentLookupValue];
     var searchValueColumn = searchValueColumnHeader.MemberAccessLiteral;
     var resultColumn = resultColumnExpression.MemberAccessLiteral;

     var lookupFunction = new LookupFunction(tableName, valueExpression, resultColumn, searchValueColumn,
       functionCallReference);
     return ParseExpressionFunctionsResult.Success(lookupFunction);
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return ValueExpression;
   }

   protected override void Validate(IValidationContext context)
   {
     ValidateColumn(context, ResultColumn, ArgumentResultColumn);
     ValidateColumn(context, SearchValueColumn, ArgumentSearchValueColumn);

     var tableType = context.RootNodes.GetTable(Table);
     if (tableType = null)
     {
       context.Logger.Fail(Reference,
         $"Invalid argument {ArgumentTable}. Table name '{Table}' not found. {FunctionHelp}");
       return;
     }

     var resultColumnHeader = tableType.Header.Get(ResultColumn);
     if (resultColumnHeader = null)
     {
       context.Logger.Fail(Reference,
         $"Invalid argument {ArgumentResultColumn}. Column name '{ResultColumn}' not found in table '{Table}'. {FunctionHelp}");
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
     ResultColumnType = resultColumnHeader.Type.CreateVariableType(context);
     SearchValueColumnType = searchColumnHeader.Type.CreateVariableType(context);

     if (conditionValueType = null | !conditionValueType.Equals(SearchValueColumnType))
       context.Logger.Fail(Reference,
         $"Invalid argument {ArgumentSearchValueColumn}. Column type '{SearchValueColumn}': '{SearchValueColumnType}' doesn't match condition type '{conditionValueType}'. {FunctionHelp}");
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
     var resultColumnHeader = tableType?.Header.Get(ResultColumn);

     return resultColumnHeader?.Type.CreateVariableType(context);
   }
}
