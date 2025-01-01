

export class LookupRowFunction extends ExpressionFunction, IHasNodeDependencies {
   private const string FunctionHelp = ` lOOKUPROW(, , ): Arguments:`;

   public const string Name = `LOOKUPROW`;

   private const number Arguments = 3;
   private const number ArgumentTable = 0;
   private const number ArgumentLookupValue = 1;
   private const number ArgumentSearchValueColumn = 2;

   public string Table

   public Expression ValueExpression

   public MemberAccessLiteral SearchValueColumn

   public VariableType SearchValueColumnType { get; private set; }
   public VariableType RowType { get; private set; }

   private LookupRowFunction(string tableType, Expression valueExpression,
     MemberAccessLiteral searchValueColumn, SourceReference tableNameArgumentReference)
     : base(tableNameArgumentReference) {
     Table = tableType ?? throw new Error(nameof(tableType));
     ValueExpression = valueExpression ?? throw new Error(nameof(valueExpression));
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

     let tableName = tableNameExpression.Identifier;
     let valueExpression = arguments[ArgumentLookupValue];
     let searchValueColumn = searchValueColumnHeader.MemberAccessLiteral;

     let lookupFunction =
       new LookupRowFunction(tableName, valueExpression, searchValueColumn, functionCallReference);
     return ParseExpressionFunctionsResult.Success(lookupFunction);
   }

   public override getChildren(): Array<INode> {
     yield return ValueExpression;
   }

   protected override validate(context: IValidationContext): void {
     ValidateColumn(context, SearchValueColumn, ArgumentSearchValueColumn);

     let tableType = context.RootNodes.GetTable(Table);
     if (tableType == null) {
       context.Logger.Fail(Reference,
         $`Invalid argument {ArgumentTable}. Table name '{Table}' not found. {FunctionHelp}`);
       return;
     }

     let searchColumnHeader = tableType.Header.Get(SearchValueColumn);
     if (searchColumnHeader == null) {
       context.Logger.Fail(Reference,
         $`Invalid argument {ArgumentSearchValueColumn}. Column name '{SearchValueColumn}' not found in table '{Table}'. {FunctionHelp}`);
       return;
     }

     let conditionValueType = ValueExpression.DeriveType(context);
     SearchValueColumnType = searchColumnHeader.Type.CreateVariableType(context);

     if (conditionValueType == null || !conditionValueType.Equals(SearchValueColumnType))
       context.Logger.Fail(Reference,
         $`Invalid argument {ArgumentSearchValueColumn}. Column type '{SearchValueColumn}': '{SearchValueColumnType}' doesn't match condition type '{conditionValueType}'. {FunctionHelp}`);

     RowType = tableType?.GetRowType(context);
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
     return tableType?.GetRowType(context);
   }
}
