import {ExpressionFunction} from "./expressionFunction";
import {IHasNodeDependencies} from "../../IHasNodeDependencies";


export class LookupRowFunction extends ExpressionFunction implements IHasNodeDependencies {

  private const string FunctionHelp = " Arguments: LOOKUPROW(Table, lookUpValue, Table.SearchValueColumn)";
   private const string functionHelp = ` lOOKUPROW(, , ): Arguments:`;

   public readonly name: string = `LOOKUPROW`;

   private const number Arguments = 3;
   private const number ArgumentTable = 0;
   private const number ArgumentLookupValue = 1;
   private const number ArgumentSearchValueColumn = 2;

  public readonly nodeType = "LookupRowFunction";
  public string Table

   public Expression valueExpression

   public MemberAccessLiteral SearchValueColumn

   public VariableType SearchValueColumnType { get; private set; }
   public VariableType RowType { get; private set; }

   private LookupRowFunction(string tableType, Expression valueExpression,
     MemberAccessLiteral searchValueColumn, SourceReference tableNameArgumentReference)
     super(tableNameArgumentReference) {
     Table = tableType ?? throw new Error(nameof(tableType));
     valueExpression = valueExpression ?? throw new Error(nameof(valueExpression));
     SearchValueColumn = searchValueColumn ?? throw new Error(nameof(searchValueColumn));
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     let table = rootNodeList.GetTable(Table);
     if (table != null) yield return table;
   }

   public static ParseExpressionFunctionsResult Parse(string name, SourceReference functionCallReference,
     IReadOnlyArray<Expression> arguments) {
     if (arguments.Count != Arguments)
       return ParseExpressionFunctionsResult.failed($`Invalid number of arguments. {functionHelp}`);

     if (!(arguments[ArgumentTable] is IdentifierExpression tableNameExpression))
       return ParseExpressionFunctionsResult.failed(
         $`Invalid argument {ArgumentTable}. Should be valid table name. {functionHelp}`);

     if (!(arguments[ArgumentSearchValueColumn] is MemberAccessExpression searchValueColumnHeader))
       return ParseExpressionFunctionsResult.failed(
         $`Invalid argument {ArgumentSearchValueColumn}. Should be search column. {functionHelp}`);

     let tableName = tableNameExpression.Identifier;
     let valueExpression = arguments[ArgumentLookupValue];
     let searchValueColumn = searchValueColumnHeader.MemberAccessLiteral;

     let lookupFunction =
       new LookupRowFunction(tableName, valueExpression, searchValueColumn, functionCallReference);
     return ParseExpressionFunctionsResult.Success(lookupFunction);
   }

   public override getChildren(): Array<INode> {
     yield return valueExpression;
   }

   protected override validate(context: IValidationContext): void {
     ValidateColumn(context, SearchValueColumn, ArgumentSearchValueColumn);

     let tableType = context.rootNodes.GetTable(Table);
     if (tableType == null) {
       context.logger.fail(this.reference,
         $`Invalid argument {ArgumentTable}. Table name '{Table}' not found. {functionHelp}`);
       return;
     }

     let searchColumnHeader = tableType.Header.Get(SearchValueColumn);
     if (searchColumnHeader == null) {
       context.logger.fail(this.reference,
         $`Invalid argument {ArgumentSearchValueColumn}. Column name '{SearchValueColumn}' not found in table '{Table}'. {functionHelp}`);
       return;
     }

     let conditionValueType = valueExpression.deriveType(context);
     SearchValueColumnType = searchColumnHeader.Type.createVariableType(context);

     if (conditionValueType == null || !conditionValueType.equals(SearchValueColumnType))
       context.logger.fail(this.reference,
         $`Invalid argument {ArgumentSearchValueColumn}. Column type '{SearchValueColumn}': '{SearchValueColumnType}' doesn't match condition type '{conditionValueType}'. {functionHelp}`);

     RowType = tableType?.GetRowType(context);
   }


   private validateColumn(context: IValidationContext, column: MemberAccessLiteral, index: number): void {
     if (column.Parent != Table)
       context.logger.fail(this.reference,
         $`Invalid argument {index}. Result column table '{column.Parent}' should be table name '{Table}'`);

     if (column.Parts.length != 2)
       context.logger.fail(this.reference,
         $`Invalid argument {index}. Result column table '{column.Parent}' should be table name '{Table}'`);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     let tableType = context.rootNodes.GetTable(Table);
     return tableType?.GetRowType(context);
   }
}
