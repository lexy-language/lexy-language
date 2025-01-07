import {INode, Node} from "../node";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {isNullOrEmpty, isValidIdentifier} from "../../parser/tokens/character";
import {NodeType} from "../nodeType";

export class ScenarioName extends Node {

  private valueValue: string;

  public readonly nodeType = NodeType.ScenarioName;

  public get value() {
    return this.valueValue;
  }

  constructor(reference: SourceReference) {
    super(reference);
  }

  public parseName(name: string): void {
    this.valueValue = name;
  }

  public override getChildren(): Array<INode> {
    return [];
  }

  protected override validate(context: IValidationContext): void {
    if (isNullOrEmpty(this.value)) {
      context.logger.fail(this.reference, `Invalid scenario name: '${this.value}'. Name should not be empty.`);
    }
    if (!isValidIdentifier(this.value)) context.logger.fail(this.reference, `Invalid scenario name: '${this.value}'.`);
  }

  public toString() {
    return this.value;
  }
}
