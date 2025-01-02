import {EndStartDateFunction} from "./endStartDateFunction";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {ExpressionFunction} from "./expressionFunction";

export class DaysFunction extends EndStartDateFunction {

   public readonly name: string = `DAYS`;

   public readonly nodeType = "DaysFunction";
   protected override get functionName() {
      return this.name;
   }

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference) {
      super(endDateExpression, startDateExpression, reference);
   }

   public static create(reference: SourceReference , endDateExpression: Expression,
     startDateExpression: Expression): ExpressionFunction {
     return new DaysFunction(endDateExpression, startDateExpression, reference);
   }
}
