import {VariableDeclarationType} from "./variableDeclarationType";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "./variableType";
import {PrimitiveType} from "./primitiveType";
import {INode} from "../node";
import {NodeType} from "../nodeType";

export function instanceOfPrimitiveVariableDeclarationType(object: any): boolean {
  return object?.nodeType == NodeType.PrimitiveVariableDeclarationType;
}

export function asPrimitiveVariableDeclarationType(object: any): PrimitiveVariableDeclarationType | null {
  return instanceOfPrimitiveVariableDeclarationType(object) ? object as PrimitiveVariableDeclarationType : null;
}

export class PrimitiveVariableDeclarationType extends VariableDeclarationType {

  public nodeType = NodeType.PrimitiveVariableDeclarationType;
  public type: string

  constructor(type: string, reference: SourceReference) {
    super(reference);
    this.type = type;
  }

  protected equals(other: PrimitiveVariableDeclarationType): boolean {
    return this.type == other.type;
  }

  public toString(): string {
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
