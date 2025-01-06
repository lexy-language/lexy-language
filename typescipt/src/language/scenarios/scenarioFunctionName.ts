import {INode, Node} from "../node";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {isNullOrEmpty, isValidIdentifier} from "../../parser/tokens/character";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {NodeType} from "../nodeType";

export class ScenarioFunctionName extends Node {

  private valueValue: string;

  public readonly nodeType = NodeType.ScenarioFunctionName;

  public get value() {
    return this.valueValue;
  }

  constructor(reference: SourceReference) {
    super(reference);
  }

  public parse(context: IParseLineContext): void {
    const name = context.line.tokens.tokenValue(1);
    if (!name) {
      context.logger.fail(this.reference, "No function name found. Use 'Function:' for inline functions.")
      return
    }
    this.valueValue = name;
  }

  public override getChildren(): Array<INode> {
    return [];
  }

  protected override validate(context: IValidationContext): void {
    if (!isNullOrEmpty(this.value) && !isValidIdentifier(this.value)) {
      context.logger.fail(this.reference, `Invalid scenario name: '${this.value}'.`);
    }
  }

  public isEmpty(): boolean {
     return isNullOrEmpty(this.valueValue);
   }
}
