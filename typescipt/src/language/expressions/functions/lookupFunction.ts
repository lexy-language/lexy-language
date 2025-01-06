import {IHasNodeDependencies} from "../../IHasNodeDependencies";
import {ExpressionFunction} from "./expressionFunction";
import {Expression} from "../expression";
import {MemberAccessLiteral} from "../../../parser/tokens/memberAccessLiteral";
import {VariableType} from "../../variableTypes/variableType";
import {SourceReference} from "../../../parser/sourceReference";
import {IRootNode} from "../../rootNode";
import {RootNodeList} from "../../rootNodeList";
import {
  newParseExpressionFunctionsFailed,
  newParseExpressionFunctionsSuccess,
  ParseExpressionFunctionsResult
} from "../parseExpressionFunctionsResult";
import {asIdentifierExpression} from "../identifierExpression";
import {asMemberAccessExpression} from "../memberAccessExpression";
import {INode} from "../../node";
import {IValidationContext} from "../../../parser/validationContext";
import {NodeType} from "../../nodeType";

const argumentsNumber = 4;
const argumentTable = 0;
const argumentLookupValue = 1;
const argumentSearchValueColumn = 2;
const argumentResultColumn = 3;
const functionHelp = `Arguments: LOOKUP(Table, lookUpValue, Table.searchValueColumn, Table.resultColumn)`;

export class LookupFunction extends ExpressionFunction implements IHasNodeDependencies {

  private resultColumnTypeValue: VariableType | null;
  private searchValueColumnTypeValue: VariableType | null;

  public readonly hasNodeDependencies = true;
  public static readonly name: string = `LOOKUP`;
   public readonly nodeType = NodeType.LookupFunction;

   public readonly table: string

   public readonly valueExpression: Expression

   public readonly resultColumn: MemberAccessLiteral;
   public readonly searchValueColumn: MemberAccessLiteral;

   public get resultColumnType(): VariableType {
     if (this.resultColumnTypeValue == null) throw new Error("resultColumnType not set");
     return this.resultColumnTypeValue;
   }
   public get searchValueColumnType(): VariableType {
     if (this.searchValueColumnTypeValue == null) throw new Error("searchValueColumnType not set");
     return this.searchValueColumnTypeValue;
   }

   constructor(tableType: string, valueExpression: Expression,
               resultColumn: MemberAccessLiteral, searchValueColumn: MemberAccessLiteral,
               tableNameArgumentReference: SourceReference) {
     super(tableNameArgumentReference);
     this.table = tableType;
     this.valueExpression = valueExpression;
     this.resultColumn = resultColumn;
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
         `Invalid argument ${argumentTable}. Should be valid table name. ${functionHelp}`);
     }

     const searchValueColumnHeader = asMemberAccessExpression(argumentValues[argumentSearchValueColumn]);
     if (searchValueColumnHeader == null) {
       return newParseExpressionFunctionsFailed(
         `Invalid argument ${argumentSearchValueColumn}. Should be search column. ${functionHelp}`);
     }

     const resultColumnExpression = asMemberAccessExpression(argumentValues[argumentResultColumn]);
     if (resultColumnExpression == null)
     {
       return newParseExpressionFunctionsFailed(
         `Invalid argument ${argumentResultColumn}. Should be result column. ${functionHelp}`);
     }

     const tableName = tableNameExpression.identifier;
     const valueExpression = argumentValues[argumentLookupValue];
     const searchValueColumn = searchValueColumnHeader.memberAccessLiteral;
     const resultColumn = resultColumnExpression.memberAccessLiteral;

     const lookupFunction = new LookupFunction(tableName, valueExpression, resultColumn, searchValueColumn,
       functionCallReference);
     return newParseExpressionFunctionsSuccess(lookupFunction);
   }

   public override getChildren(): Array<INode> {
     return [this.valueExpression];
   }

   protected override validate(context: IValidationContext): void {
     this.validateColumn(context, this.resultColumn, argumentResultColumn);
     this.validateColumn(context, this.searchValueColumn, argumentSearchValueColumn);

     const tableType = context.rootNodes.getTable(this.table);
     if (tableType == null) {
       context.logger.fail(this.reference,
         `Invalid argument ${argumentTable}. Table name '${this.table}' not found. ${functionHelp}`);
       return;
     }

     const resultColumnHeader = tableType.header?.get(this.resultColumn);
     if (resultColumnHeader == null) {
       context.logger.fail(this.reference,
         `Invalid argument ${argumentResultColumn}. Column name '${this.resultColumn}' not found in table '${this.table}'. ${functionHelp}`);
       return;
     }

     const searchColumnHeader = tableType.header?.get(this.searchValueColumn);
     if (searchColumnHeader == null) {
       context.logger.fail(this.reference,
         `Invalid argument ${argumentSearchValueColumn}. Column name '${this.searchValueColumn}' not found in table '${this.table}'. ${functionHelp}`);
       return;
     }

     const conditionValueType = this.valueExpression.deriveType(context);
     this.resultColumnTypeValue = resultColumnHeader.type.createVariableType(context);
     this.searchValueColumnTypeValue = searchColumnHeader.type.createVariableType(context);

     if (conditionValueType == null || !conditionValueType.equals(this.searchValueColumnTypeValue)) {
       context.logger.fail(this.reference,
         `Invalid argument ${argumentSearchValueColumn}. Column type '${this.searchValueColumn}': '${this.searchValueColumnType}' doesn't match condition type '${conditionValueType}'. ${functionHelp}`);
     }
   }

   private validateColumn(context: IValidationContext, column: MemberAccessLiteral, index: number): void {
     if (column.parent != this.table) {
       context.logger.fail(this.reference,
         `Invalid argument ${index}. Result column table '${column.parent}' should be table name '${this.table}'`);
     }

     if (column.parts.length != 2) {
       context.logger.fail(this.reference,
         `Invalid argument ${index}. Result column table '${column.parent}' should be table name '${this.table}'`);
     }
   }

   public override deriveReturnType(context: IValidationContext): VariableType | null {
     let tableType = context.rootNodes.getTable(this.table);
     let resultColumnHeader = tableType?.header?.get(this.resultColumn);

     const variableType = resultColumnHeader?.type.createVariableType(context);
     return !!variableType ? variableType : null;
   }
}
