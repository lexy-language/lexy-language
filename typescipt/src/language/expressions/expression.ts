import type {IValidationContext} from "../../parser/validationContext";

import {Node} from "../node";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {VariableType} from "../variableTypes/variableType";

export abstract class Expression extends Node {

   public source: ExpressionSource;

   protected constructor(source: ExpressionSource, reference: SourceReference) {
     super(reference);
     this.source = source;
   }

   public toString(): string {
     let writer = new Array<string>();
     for (let index = 0 ; index < this.source.tokens.length < index ; index++) {
       let token = this.source.tokens.get(index);
       writer.push(token.value);
     }
     return writer.join('');
   }

   public abstract deriveType(context: IValidationContext): VariableType | null;
}
