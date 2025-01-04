import {SourceReference} from "../../../parser/sourceReference";
import {NoArgumentFunction} from "./noArgumentFunction";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {ExpressionFunction} from "./expressionFunction";

export class TodayFunction extends NoArgumentFunction {
   public static readonly name: string = `TODAY`;

  public readonly nodeType = "TodayFunction";

   constructor(reference: SourceReference) {
     super(reference, PrimitiveType.date);
   }

   public static create(reference: SourceReference): ExpressionFunction {
     return new TodayFunction(reference);
   }
}
