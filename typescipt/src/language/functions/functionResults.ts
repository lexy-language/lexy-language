import {VariableDefinition} from "../variableDefinition";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {IParsableNode, ParsableNode} from "../parsableNode";
import {VariableSource} from "../variableSource";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";

export class FunctionResults extends ParsableNode {

  private variablesValue: Array<VariableDefinition> = [];

  public readonly nodeType = "FunctionResults";

  public get variables(): ReadonlyArray<VariableDefinition> {
    return this.variablesValue;
  }

  constructor(reference: SourceReference) {
    super(reference);
  }

  public override parse(context: IParseLineContext): IParsableNode {
    let variableDefinition = VariableDefinition.parse(VariableSource.Results, context);
    if (variableDefinition == null) return this;

    if (variableDefinition.defaultExpression != null) {
      context.logger.fail(this.reference,
        `Result variable '${variableDefinition.name}' should not have a default value.`);
      return this;
    }

    this.variablesValue.push(variableDefinition);

    return this;
  }

  public override getChildren(): Array<INode> {
    return [...this.variables];
  }

  protected override validate(context: IValidationContext): void {
  }
}
