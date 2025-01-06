import {RootNode} from "../rootNode";
import {TableName} from "./tableName";
import {TableHeader} from "./tableHeader";
import {TableRow} from "./tableRow";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {IParsableNode} from "../parsableNode";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {ComplexType} from "../variableTypes/complexType";
import {ComplexTypeMember} from "../variableTypes/complexTypeMember";
import {NodeType} from "../nodeType";

export function instanceOfTable(object: any) {
  return object?.nodeType == NodeType.Table;
}

export function asTable(object: any): Table | null {
  return instanceOfTable(object) ? object as Table : null;
}

export class Table extends RootNode {

  public static readonly rowName: string = `Row`;
  private rowsValue: Array<TableRow> = [];
  private headerValue: TableHeader | null;

  public readonly nodeType = NodeType.Table;
  public readonly name: TableName = new TableName();

  public get header(): TableHeader | null {
    return this.headerValue;
  }

  get rows(): Array<TableRow> {
    return this.rowsValue;
  }

  public override get nodeName() {
    return this.name.value;
  }

  constructor(name: string, reference: SourceReference) {
    super(reference);
    this.name.parseName(name);
  }

  public static parse(name: string, reference: SourceReference): Table {
    return new Table(name, reference);
  }

   public override parse(context: IParseLineContext): IParsableNode {
     if (this.isFirstLine()) {
       this.headerValue = TableHeader.parse(context);
     } else {
       const tableRow = TableRow.parse(context);
       if (tableRow != null) this.rows.push(tableRow);
     }

     return this;
   }

   private isFirstLine(): boolean {
     return this.header == null;
   }

   public override getChildren(): Array<INode> {
     if (this.header != null) {
       return [this.header, ...this.rows];
     } else {
       return [...this.rows];
     }
   }

   protected override validate(context: IValidationContext): void {
   }

   public override validateTree(context: IValidationContext): void {
     const scope = context.createVariableScope();
     try {
       super.validateTree(context);
     } finally {
       scope[Symbol.dispose]();
     }
   }

   public getRowType(context: IValidationContext): ComplexType {
    if (this.header == null) throw new Error("Header not set.");
     const members = this.header.columns.map(column => {
       const type = column.type.createVariableType(context);
       return new ComplexTypeMember(column.name, type)
     });

     return new ComplexType(this.name.value, ComplexTypeSource.TableRow, members);
   }
}
