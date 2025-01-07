import {PrimitiveType} from "../../variableTypes/primitiveType";
import {SingleArgumentFunction} from "./singleArgumentFunction";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {ExpressionFunction} from "./expressionFunction";
import {NodeType} from "../../nodeType";

export class DayFunction extends SingleArgumentFunction {

   public readonly nodeType = NodeType.DayFunction;
   public static readonly name = `DAY`;

   protected override get functionHelp(): string {
      return `${DayFunction.name} expects 1 argument (Date)`;
   }

   constructor(valueExpression: Expression, reference: SourceReference) {
      super(valueExpression, reference, PrimitiveType.date, PrimitiveType.number);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new DayFunction(expression, reference);
   }
}
