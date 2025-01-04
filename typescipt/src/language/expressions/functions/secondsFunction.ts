import {EndStartDateFunction} from "./endStartDateFunction";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {ExpressionFunction} from "./expressionFunction";

export class SecondsFunction extends EndStartDateFunction {

  public static readonly name: string = `SECONDS`;
   public readonly nodeType = "SecondsFunction";

  protected override get functionName() {
    return this.name;
  }

  constructor(endDateExpression: Expression, startDateExpression: Expression, reference: SourceReference) {
    super(endDateExpression, startDateExpression, reference);
  }

   public static create(reference: SourceReference, endDateExpression: Expression,
     startDateExpression: Expression): ExpressionFunction {
     return new SecondsFunction(endDateExpression, startDateExpression, reference);
   }
}
