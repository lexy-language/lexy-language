import {IParsableNode, ParsableNode} from "../parsableNode";
import {VariableDefinition} from "../variableDefinition";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {VariableSource} from "../variableSource";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {NodeType} from "../nodeType";

export class FunctionParameters extends ParsableNode {

  private variablesValue: Array<VariableDefinition> = [];

  public readonly nodeType = NodeType.FunctionParameters;

  public get variables(): ReadonlyArray<VariableDefinition> {
     return this.variablesValue;
   }

   constructor(reference: SourceReference) {
     super(reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let variableDefinition = VariableDefinition.parse(VariableSource.Parameters, context);
     if (variableDefinition != null) this.variablesValue.push(variableDefinition);
     return this;
   }

   public override getChildren(): Array<INode> {
     return [...this.variables];
   }

   protected override validate(context: IValidationContext): void {
   }
}
