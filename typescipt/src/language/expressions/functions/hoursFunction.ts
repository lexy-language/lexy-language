import {EndStartDateFunction} from "./endStartDateFunction";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {ExpressionFunction} from "./expressionFunction";

export class HoursFunction extends EndStartDateFunction {

   public readonly name: string = `HOURS`;
   public readonly nodeType = "HoursFunction";

   protected override get functionName(): string {
     return this.name;
   }

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference) {
     super(endDateExpression, startDateExpression, reference);
   }

   public static create(reference: SourceReference, endDateExpression: Expression,
     startDateExpression: Expression): ExpressionFunction  {
     return new HoursFunction(endDateExpression, startDateExpression, reference);
   }
}
