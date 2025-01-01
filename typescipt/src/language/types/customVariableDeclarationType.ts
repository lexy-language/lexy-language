import {VariableDeclarationType} from "./variableDeclarationType";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "./variableType";
import {INode} from "../node";

export class CustomVariableDeclarationType extends VariableDeclarationType {

  public nodeType: "CustomVariableDeclarationType";
  public type: string;

   constructor(type: string, reference: SourceReference) {
     super(reference);
     this.type = type;
   }

   private equals(other: CustomVariableDeclarationType): boolean {
     return this.type == other.type;
   }

   public override toString(): string {
     return this.type;
   }

   public override createVariableType(context: IValidationContext): VariableType {
     return context.rootNodes.getType(this.type);
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
     this.variableType = this.createVariableType(context);
   }
}
