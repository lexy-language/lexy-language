import {VariableType} from "./variableType";
import {SourceReference} from "../../parser/sourceReference";
import {Node} from "../node"
import {Keywords} from "../../parser/Keywords";
import {TypeNames} from "./TypeNames";
import {IValidationContext} from "../../parser/validationContext";
import {ImplicitVariableDeclaration} from "./implicitVariableDeclaration";
import {PrimitiveVariableDeclarationType} from "./primitiveVariableDeclarationType";
import {CustomVariableDeclarationType} from "./customVariableDeclarationType";

export abstract class VariableDeclarationType extends Node {
   public variableType: VariableType;

   constructor(reference: SourceReference) {
     super(reference);
   }

   public static parse(type: string, reference: SourceReference): VariableDeclarationType {
     if (type == Keywords.ImplicitVariableDeclaration) return new ImplicitVariableDeclaration(reference);
     if (TypeNames.contains(type)) return new PrimitiveVariableDeclarationType(type, reference);

     return new CustomVariableDeclarationType(type, reference);
   }

   public abstract createVariableType(context: IValidationContext): VariableType;
}
