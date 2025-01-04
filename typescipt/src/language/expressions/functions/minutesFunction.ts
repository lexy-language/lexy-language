import {EndStartDateFunction} from "./endStartDateFunction";
import {SourceReference} from "../../../parser/sourceReference";
import {Expression} from "../expression";
import {ExpressionFunction} from "./expressionFunction";

export class MinutesFunction extends EndStartDateFunction {
   public static readonly name: string = `MINUTES`;

   public readonly nodeType = "MinutesFunction";

  protected override get functionName() {
    return this.name;
  }

   constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference) {
     super(endDateExpression, startDateExpression, reference);
   }

   public static create(reference: SourceReference, endDateExpression: Expression,
     startDateExpression: Expression): ExpressionFunction  {
     return new MinutesFunction(endDateExpression, startDateExpression, reference);
   }
}
