import {SourceReference} from "../../parser/sourceReference";
import {INode, Node} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {isNullOrEmpty, isValidIdentifier} from "../../parser/tokens/character";

export class EnumName extends Node {

  private valueValue: string;

  public nodeType = "EnumName";

  public get value() {
    return this.valueValue;
  }

   constructor(sourceReference: SourceReference) {
     super(sourceReference);
   }

   public parseName(parameter: string): void {
     this.valueValue = parameter;
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
     if (isNullOrEmpty(this.value)) {
       context.logger.fail(this.reference, `Invalid enum name: ${this.value}. Name should not be empty.`);
     }
     if (!isValidIdentifier(this.value)) {
       context.logger.fail(this.reference, `Invalid enum name: ${this.value}.`);
     }
   }
}
