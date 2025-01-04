import {VariableDeclarationType} from "./variableDeclarationType";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "./variableType";
import {INode} from "../node";

export function instanceOfCustomVariableDeclarationType(object: any): boolean {
  return object?.nodeType == "CustomVariableDeclarationType";
}

export function asCustomVariableDeclarationType(object: any): CustomVariableDeclarationType | null {
  return instanceOfCustomVariableDeclarationType(object) ? object as CustomVariableDeclarationType : null;
}

export class CustomVariableDeclarationType extends VariableDeclarationType {

  public nodeType = "CustomVariableDeclarationType";
  public type: string;

   constructor(type: string, reference: SourceReference) {
     super(reference);
     this.type = type;
   }

   private equals(other: CustomVariableDeclarationType): boolean {
     return this.type == other.type;
   }

   public toString(): string {
     return this.type;
   }

   public override createVariableType(context: IValidationContext): VariableType | null {
     return  context.rootNodes.getType(this.type);
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
     this.setVariableType(this.createVariableType(context));
   }
}
