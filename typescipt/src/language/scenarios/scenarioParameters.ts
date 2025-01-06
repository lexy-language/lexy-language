import {IParsableNode, ParsableNode} from "../parsableNode";
import {AssignmentDefinition} from "./assignmentDefinition";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {NodeType} from "../nodeType";

export class ScenarioParameters extends ParsableNode {

  private assignmentsValue: Array<AssignmentDefinition> = [];

  public nodeType = NodeType.ScenarioParameters;

  public get assignments(): ReadonlyArray<AssignmentDefinition> {
    return this.assignmentsValue;
  }

  constructor(reference: SourceReference) {
    super(reference);
  }

  public override parse(context: IParseLineContext): IParsableNode {
    let assignment = AssignmentDefinition.parse(context);
    if (assignment != null) this.assignmentsValue.push(assignment);
    return this;
  }

  public override getChildren(): Array<INode> {
    return [...this.assignmentsValue];
  }

  protected override validate(context: IValidationContext): void {
  }
}