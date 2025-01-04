import {SingleArgumentFunction} from "./singleArgumentFunction";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {ExpressionFunction} from "./expressionFunction";

export class HourFunction extends SingleArgumentFunction {

   public readonly nodeType = "HourFunction";
   public static readonly name = `HOUR`;

   protected override get functionHelp() {
      return `${HourFunction.name} expects 1 argument (Date)`;
   }

   constructor(valueExpression: Expression, reference: SourceReference) {
     super(valueExpression, reference, PrimitiveType.date, PrimitiveType.number);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new HourFunction(expression, reference);
   }
}
