import {IParsableNode, ParsableNode} from "../parsableNode";
import {TableHeader} from "../tables/tableHeader";
import {TableRow} from "../tables/tableRow";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";

export class ScenarioTable extends ParsableNode {

  private headerValue: TableHeader | null;
  private rowsValue: Array<TableRow>;

  public nodeType = "ScenarioTable";

  public get rows(): ReadonlyArray<TableRow>{
    return this.rows;
  }

  public get header() {
    return this.headerValue;
  }

  constructor(reference: SourceReference) {
     super(reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     if (this.headerValue == null) {
       this.headerValue = TableHeader.parse(context);
       return this;
     }

     let row = TableRow.parse(context);
     if (row != null) this.rowsValue.push(row);

     return this;
   }

   public override getChildren(): Array<INode> {
    return this.headerValue != null ? [this.headerValue, ...this.rowsValue] :  [...this.rowsValue];
   }

   protected override validate(context: IValidationContext): void {
   }
}