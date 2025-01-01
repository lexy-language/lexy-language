import {VariableDeclarationType} from "./variableDeclarationType";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "./variableType";
import {PrimitiveType} from "./primitiveType";
import {INode} from "../node";

export class PrimitiveVariableDeclarationType extends VariableDeclarationType {

  public nodeType: "PrimitiveVariableDeclarationType";
  public type: string

  constructor(type: string, reference: SourceReference) {
    super(reference);
    this.type = type;
  }

  protected equals(other: PrimitiveVariableDeclarationType): boolean {
    return this.type == other.type;
  }

  public override toString(): string {
    return this.type;
  }

  public override createVariableType(context: IValidationContext): VariableType {
    return new PrimitiveType(this.type);
  }

  public override getChildren(): Array<INode> {
    return [];
  }

  protected override validate(context: IValidationContext): void {
  }
}
