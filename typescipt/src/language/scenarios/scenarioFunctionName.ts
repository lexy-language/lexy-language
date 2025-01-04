import {INode, Node} from "../node";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {isNullOrEmpty, isValidIdentifier} from "../../parser/tokens/character";

export class ScenarioFunctionName extends Node {

  private valueValue: string;

  public readonly nodeType = "ScenarioFunctionName";

  public get value() {
    return this.valueValue;
  }

  constructor(reference: SourceReference) {
    super(reference);
  }

  public parse(name: string): void {
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

  public isEmpty(): boolean {
     return isNullOrEmpty(this.valueValue);
   }
}
