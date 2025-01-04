import {ExpressionFunction} from "./expressionFunction";
import {IHasNodeDependencies} from "../../IHasNodeDependencies";
import {VariableType} from "../../variableTypes/variableType";
import {MemberAccessLiteral} from "../../../parser/tokens/memberAccessLiteral";
import {Expression} from "../expression";
import {RootNodeList} from "../../rootNodeList";
import {IRootNode} from "../../rootNode";
import {SourceReference} from "../../../parser/sourceReference";
import {
  newParseExpressionFunctionsFailed,
  newParseExpressionFunctionsSuccess,
  ParseExpressionFunctionsResult
} from "../parseExpressionFunctionsResult";
import {asIdentifierExpression} from "../identifierExpression";
import {INode} from "../../node";
import {IValidationContext} from "../../../parser/validationContext";
import {asMemberAccessExpression} from "../memberAccessExpression";

const argumentsNumber = 3;
const argumentTable = 0;
const argumentLookupValue = 1;
const argumentSearchValueColumn = 2;
const functionHelp = " Arguments: LOOKUPROW(Table, lookUpValue, Table.searchValueColumn)";

export class LookupRowFunction extends ExpressionFunction implements IHasNodeDependencies {

  private searchValueColumnTypeValue: VariableType | null;
  private rowTypeValue: VariableType | null;

  public readonly hasNodeDependencies: true;
  public static readonly name: string = `LOOKUPROW`;

  public readonly nodeType = "LookupRowFunction";
  public readonly table: string

   public readonly valueExpression: Expression

   public readonly searchValueColumn: MemberAccessLiteral
   
  public get searchValueColumnType(): VariableType {
    if (this.searchValueColumnTypeValue == null) throw new Error("rowType not set.");
    return this.searchValueColumnTypeValue;
  }
   public get rowType(): VariableType{
     if (this.rowTypeValue == null) throw new Error("rowType not set.");
     return this.rowTypeValue;
   }

   constructor(tableType: string, valueExpression: Expression,
     searchValueColumn: MemberAccessLiteral, tableNameArgumentReference: SourceReference) {
     super(tableNameArgumentReference);
     this.table = tableType;
     this.valueExpression = valueExpression;
     this.searchValueColumn = searchValueColumn;
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     let table = rootNodeList.getTable(this.table);
     return table != null ? [table] : [];
   }

   public static parse(name: string, functionCallReference: SourceReference,
    argumentValues: Array<Expression>): ParseExpressionFunctionsResult {
     if (argumentValues.length != argumentsNumber) {
       return newParseExpressionFunctionsFailed(`Invalid number of arguments. ${functionHelp}`);
     }

     const tableNameExpression = asIdentifierExpression(argumentValues[argumentTable]);
     if (tableNameExpression == null) {
       return newParseExpressionFunctionsFailed(
         `Invalid argument {ArgumentTable}. Should be valid table name. {functionHelp}`);
     }

     const searchValueColumnHeader = asMemberAccessExpression(argumentValues[argumentSearchValueColumn]);
     if (searchValueColumnHeader == null) {
       return newParseExpressionFunctionsFailed(
         `Invalid argument {ArgumentSearchValueColumn}. Should be search column. {functionHelp}`);
     }

     let tableName = tableNameExpression.identifier;
     let valueExpression = argumentValues[argumentLookupValue];
     let searchValueColumn = searchValueColumnHeader.memberAccessLiteral;

     let lookupFunction =
       new LookupRowFunction(tableName, valueExpression, searchValueColumn, functionCallReference);
     return newParseExpressionFunctionsSuccess(lookupFunction);
   }

   public override getChildren(): Array<INode> {
     return [this.valueExpression];
   }

   protected override validate(context: IValidationContext): void {
     this.validateColumn(context, this.searchValueColumn, argumentSearchValueColumn);

     let tableType = context.rootNodes.getTable(this.table);
     if (tableType == null) {
       context.logger.fail(this.reference,
         `Invalid argument ${argumentTable}. Table name '${this.table}' not found. ${functionHelp}`);
       return;
     }

     let searchColumnHeader = tableType.header?.get(this.searchValueColumn);
     if (searchColumnHeader == null) {
       context.logger.fail(this.reference,
         `Invalid argument ${argumentSearchValueColumn}. Column name '${this.searchValueColumn}' not found in table '${this.table}'. $functionHelp}`);
       return;
     }

     let conditionValueType = this.valueExpression.deriveType(context);
     this.searchValueColumnTypeValue = searchColumnHeader.type.createVariableType(context);

     if (conditionValueType == null || !conditionValueType.equals(this.searchValueColumnType)) {
       context.logger.fail(this.reference,
         `Invalid argument ${argumentSearchValueColumn}. Column type '${this.searchValueColumn}': '${this.searchValueColumnType}' doesn't match condition type '${conditionValueType}'. ${functionHelp}`);
     }

     const rowTypeValue = tableType?.getRowType(context);
     this.rowTypeValue = !!rowTypeValue ? rowTypeValue : null;
   }

   private validateColumn(context: IValidationContext, column: MemberAccessLiteral, index: number): void {
     if (column.parent != this.table)
       context.logger.fail(this.reference,
         `Invalid argument ${index}. Result column table '${column.parent}' should be table name '${this.table}'`);

     if (column.parts.length != 2)
       context.logger.fail(this.reference,
         `Invalid argument ${index}. Result column table '${column.parent}' should be table name '${this.table}'`);
   }

   public override deriveReturnType(context: IValidationContext): VariableType | null {
     let tableType = context.rootNodes.getTable(this.table);
     const rowTypeValue = tableType?.getRowType(context);
     return !!rowTypeValue ? rowTypeValue : null;
   }
}
