import type {IRootNode} from "../../../language/rootNode";
import type {IRootTokenWriter} from "../../IRootTokenWriter";

import {GeneratedType, GeneratedTypeKind} from "../../generatedType";
import {asTable, Table} from "../../../language/tables/table";
import {tableClassName} from "../classNames";
import {CodeWriter} from "./codeWriter";
import {renderTypeDefaultExpression} from "./renderVariableClass";
import {LexyCodeConstants} from "../../lexyCodeConstants";
import {renderValueExpression} from "./renderExpression";

export class TableWriter implements IRootTokenWriter {

  private readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  public createCode(node: IRootNode): GeneratedType {
    const table = asTable(node);
    if (table == null) throw new Error(`Root token not Table`);

    const className = tableClassName(table.name.value);

    const codeWriter = new CodeWriter(this.namespace);
    codeWriter.openScope("function scope()");

    this.renderRowClass(LexyCodeConstants.rowType, table, codeWriter);
    this.renderValues(LexyCodeConstants.rowType, table, codeWriter);

    codeWriter.openScope(`return`)
    codeWriter.writeLine(`${LexyCodeConstants.rowType}: ${LexyCodeConstants.rowType},`)
    codeWriter.writeLine(`Count: ${LexyCodeConstants.valuesVariable}.length,`)
    codeWriter.writeLine(`Values: ${LexyCodeConstants.valuesVariable}`)
    codeWriter.closeScope(";")

    codeWriter.closeScope("();");

    return new GeneratedType(GeneratedTypeKind.type, node, className, codeWriter.toString());
  }

  private renderRowClass(rowName: string, table: Table, codeWriter: CodeWriter) {
    codeWriter.openScope("class " + rowName);
    for (const column of table.header?.columns) {
      codeWriter.startLine(column.name + " = ")
      renderTypeDefaultExpression(column.type, codeWriter);
      codeWriter.endLine(";")
    }
    codeWriter.startLine("constructor(")
    for (let i = 0; i < table.header?.columns.length; i++) {
      const column = table.header?.columns[i];
      codeWriter.write(column?.name ?? "")
      if (i < table.header?.columns.length - 1) {
        codeWriter.write(",")
      }
    }
    codeWriter.openInlineScope(")")
    for (const column of table.header?.columns) {
      codeWriter.writeLine("this." + column.name + " = " + column.name + ";")
    }

    codeWriter.closeScope();
    codeWriter.closeScope();
  }

  private renderValues(rowName: string, table: Table, codeWriter: CodeWriter) {
    codeWriter.openBrackets(`const ${LexyCodeConstants.valuesVariable} = `);
    for (const row of table.rows) {
      codeWriter.startLine("new " + rowName + "(")
      for (let rowIndex = 0; rowIndex < row.values.length; rowIndex++) {
        const value = row.values[rowIndex];
        renderValueExpression(value, codeWriter)
        if (rowIndex < row.values.length - 1) {
          codeWriter.write(",")
        }
      }
      codeWriter.endLine("),")
    }
    codeWriter.closeBrackets();
  }
}
