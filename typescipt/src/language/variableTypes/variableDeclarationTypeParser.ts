import {SourceReference} from "../../parser/sourceReference";
import {Keywords} from "../../parser/Keywords";
import {ImplicitVariableDeclaration} from "./implicitVariableDeclaration";
import {TypeNames} from "./typeNames";
import {PrimitiveVariableDeclarationType} from "./primitiveVariableDeclarationType";
import {CustomVariableDeclarationType} from "./customVariableDeclarationType";
import {VariableDeclarationType} from "./variableDeclarationType";

export class VariableDeclarationTypeParser {
  public static parse(type: string, reference: SourceReference): VariableDeclarationType {
    if (type == Keywords.ImplicitVariableDeclaration) return new ImplicitVariableDeclaration(reference);
    if (TypeNames.contains(type)) return new PrimitiveVariableDeclarationType(type, reference);

    return new CustomVariableDeclarationType(type, reference);
  }
}