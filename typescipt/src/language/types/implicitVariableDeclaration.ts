import {VariableDeclarationType} from "./variableDeclarationType";
import {VariableType} from "./variableType";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {INode} from "../node";

export class ImplicitVariableDeclaration extends VariableDeclarationType {

  public nodeType: "ImplicitVariableDeclaration";
  public variableType: VariableType;

   constructor(reference: SourceReference) {
     super(reference);
   }

   public override createVariableType(context: IValidationContext): VariableType {
     return VariableType ??
        throw new Error(`Not supported. Nodes should be Validated first.`);
   }

   public define(variableType: VariableType): void {
     this.variableType = variableType;
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
   }
}
