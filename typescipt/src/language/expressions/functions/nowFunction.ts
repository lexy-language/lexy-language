import {NoArgumentFunction} from "./noArgumentFunction";
import {SourceReference} from "../../../parser/sourceReference";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {ExpressionFunction} from "./expressionFunction";

export class NowFunction extends NoArgumentFunction {

   public static readonly name: string = `NOW`;

  public readonly nodeType = "NowFunction";

   constructor(reference: SourceReference) {
     super(reference, PrimitiveType.date);
   }

   public static create(reference: SourceReference): ExpressionFunction {
     return new NowFunction(reference);
   }
}
