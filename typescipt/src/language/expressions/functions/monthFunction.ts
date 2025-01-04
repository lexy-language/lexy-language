import {SingleArgumentFunction} from "./singleArgumentFunction";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {ExpressionFunction} from "./expressionFunction";

export class MonthFunction extends SingleArgumentFunction {

   public static readonly name: string = `MONTH`;

   public readonly nodeType = "MonthFunction";

   protected override get functionHelp(): string {
      return `'{Name} expects 1 argument (Date)`;
   }

   constructor(valueExpression: Expression, reference: SourceReference) {
      super(valueExpression, reference, PrimitiveType.date, PrimitiveType.number);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new MonthFunction(expression, reference);
   }
}
