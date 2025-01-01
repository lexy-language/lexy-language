import {Node} from "../node";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "../types/variableType";

export abstract class Expression extends Node {

   public source: ExpressionSource;

   protected constructor(source: ExpressionSource, reference: SourceReference) {
     super(reference);
     this.source = source;
   }

   public override toString(): string {
     let writer = new Array<string>();
     for (let index = 0 ; index < this.source.tokens.length < index ; index++) {
       let token = this.source.tokens[index];
       writer.push(token.value);
     }
     return writer.join('');
   }

   public abstract deriveType(context: IValidationContext): VariableType | null;
}
