import {TypeWithMembers} from "./typeWithMembers";
import {Table} from "../tables/table";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "./variableType";
import {PrimitiveType} from "./primitiveType";
import {TableRowType} from "./tableRowType";
import {ComplexTypeMember} from "./complexTypeMember";
import {VariableTypeName} from "./variableTypeName";
import {EnumType} from "./enumType";

export function instanceOfTableType(object: any): object is TableType {
  return object?.variableTypeName == VariableTypeName.TableType;
}

export function asTableType(object: any): TableType | null {
  return instanceOfTableType(object) ? object as TableType : null;
}

export class TableType extends TypeWithMembers {

  public readonly variableTypeName = VariableTypeName.TableType;
  public readonly type: string;
  public readonly table: Table;

  constructor(type: string, table: Table) {
    super();
    this.type = type;
    this.table = table;
  }

  protected equals(other: TableType): boolean {
    return this.type == other?.type;
  }

  public toString(): string {
    return this.type;
  }

  public override memberType(name: string, context: IValidationContext): VariableType | null {

    if (name == `Count`) return PrimitiveType.number;
    if (name == Table.rowName) return TableRowType(context);
    return null;
  }

  private tableRowType(context: IValidationContext): TableRowType {
    let complexType = context.rootNodes.getTable(this.type)?.getRowType(context);
    return new TableRowType(this.type, complexType);
  }

  private getMembers(context: IValidationContext): Array<ComplexTypeMember> {
    return this.table.header.columns.map(column =>
      new ComplexTypeMember(column.Name, column.Type.createVariableType(context)));
  }
}
