

export class LookupFunction extends ExpressionFunction, IHasNodeDependencies {
   private const string FunctionHelp =
     `Arguments: LOOKUP(Table, lookUpValue, Table.SearchValueColumn, Table.ResultColumn)`;

   public const string Name = `LOOKUP`;

   private const number Arguments = 4;
   private const number ArgumentTable = 0;
   private const number ArgumentLookupValue = 1;
   private const number ArgumentSearchValueColumn = 2;
   private const number ArgumentResultColumn = 3;

   public string Table

   public Expression ValueExpression

   public MemberAccessLiteral ResultColumn
   public MemberAccessLiteral SearchValueColumn

   public VariableType ResultColumnType { get; private set; }
   public VariableType SearchValueColumnType { get; private set; }

   private LookupFunction(string tableType, Expression valueExpression,
     MemberAccessLiteral resultColumn, MemberAccessLiteral searchValueColumn,
     SourceReference tableNameArgumentReference)
     : base(tableNameArgumentReference) {
     Table = tableType ?? throw new Error(nameof(tableType));
     ValueExpression = valueExpression ?? throw new Error(nameof(valueExpression));
     ResultColumn = resultColumn ?? throw new Error(nameof(resultColumn));
     SearchValueColumn = searchValueColumn ?? throw new Error(nameof(searchValueColumn));
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     let table = rootNodeList.GetTable(Table);
     if (table != null) yield return table;
   }

   public static ParseExpressionFunctionsResult Parse(string name, SourceReference functionCallReference,
     IReadOnlyArray<Expression> arguments) {
     if (arguments.Count != Arguments)
       return ParseExpressionFunctionsResult.Failed($`Invalid number of arguments. {FunctionHelp}`);

     if (!(arguments[ArgumentTable] is IdentifierExpression tableNameExpression))
       return ParseExpressionFunctionsResult.Failed(
         $`Invalid argument {ArgumentTable}. Should be valid table name. {FunctionHelp}`);

     if (!(arguments[ArgumentSearchValueColumn] is MemberAccessExpression searchValueColumnHeader))
       return ParseExpressionFunctionsResult.Failed(
         $`Invalid argument {ArgumentSearchValueColumn}. Should be search column. {FunctionHelp}`);

     if (!(arguments[ArgumentResultColumn] is MemberAccessExpression resultColumnExpression))
       return ParseExpressionFunctionsResult.Failed(
         $`Invalid argument {ArgumentResultColumn}. Should be result column. {FunctionHelp}`);

     let tableName = tableNameExpression.Identifier;
     let valueExpression = arguments[ArgumentLookupValue];
     let searchValueColumn = searchValueColumnHeader.MemberAccessLiteral;
     let resultColumn = resultColumnExpression.MemberAccessLiteral;

     let lookupFunction = new LookupFunction(tableName, valueExpression, resultColumn, searchValueColumn,
       functionCallReference);
     return ParseExpressionFunctionsResult.Success(lookupFunction);
   }

   public override getChildren(): Array<INode> {
     yield return ValueExpression;
   }

   protected override validate(context: IValidationContext): void {
     ValidateColumn(context, ResultColumn, ArgumentResultColumn);
     ValidateColumn(context, SearchValueColumn, ArgumentSearchValueColumn);

     let tableType = context.RootNodes.GetTable(Table);
     if (tableType == null) {
       context.Logger.Fail(Reference,
         $`Invalid argument {ArgumentTable}. Table name '{Table}' not found. {FunctionHelp}`);
       return;
     }

     let resultColumnHeader = tableType.Header.Get(ResultColumn);
     if (resultColumnHeader == null) {
       context.Logger.Fail(Reference,
         $`Invalid argument {ArgumentResultColumn}. Column name '{ResultColumn}' not found in table '{Table}'. {FunctionHelp}`);
       return;
     }

     let searchColumnHeader = tableType.Header.Get(SearchValueColumn);
     if (searchColumnHeader == null) {
       context.Logger.Fail(Reference,
         $`Invalid argument {ArgumentSearchValueColumn}. Column name '{SearchValueColumn}' not found in table '{Table}'. {FunctionHelp}`);
       return;
     }

     let conditionValueType = ValueExpression.DeriveType(context);
     ResultColumnType = resultColumnHeader.Type.CreateVariableType(context);
     SearchValueColumnType = searchColumnHeader.Type.CreateVariableType(context);

     if (conditionValueType == null || !conditionValueType.Equals(SearchValueColumnType))
       context.Logger.Fail(Reference,
         $`Invalid argument {ArgumentSearchValueColumn}. Column type '{SearchValueColumn}': '{SearchValueColumnType}' doesn't match condition type '{conditionValueType}'. {FunctionHelp}`);
   }

   private validateColumn(context: IValidationContext, column: MemberAccessLiteral, index: number): void {
     if (column.Parent != Table)
       context.Logger.Fail(Reference,
         $`Invalid argument {index}. Result column table '{column.Parent}' should be table name '{Table}'`);

     if (column.Parts.Length != 2)
       context.Logger.Fail(Reference,
         $`Invalid argument {index}. Result column table '{column.Parent}' should be table name '{Table}'`);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     let tableType = context.RootNodes.GetTable(Table);
     let resultColumnHeader = tableType?.Header.Get(ResultColumn);

     return resultColumnHeader?.Type.CreateVariableType(context);
   }
}
