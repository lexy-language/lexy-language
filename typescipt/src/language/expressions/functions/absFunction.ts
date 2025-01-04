import {SingleArgumentFunction} from "./singleArgumentFunction";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {SourceReference} from "../../../parser/sourceReference";
import {Expression} from "../expression";
import {ExpressionFunction} from "./expressionFunction";

export class AbsFunction extends SingleArgumentFunction {

   public readonly nodeType = "AbsFunction";
   public static readonly name = `ABS`;

   protected override get functionHelp(): string {
      return `${AbsFunction.name} expects 1 argument (Value)`;
   }

   constructor(valueExpression: Expression, reference: SourceReference) {
     super(valueExpression, reference, PrimitiveType.number, PrimitiveType.number);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new AbsFunction(expression, reference);
   }
}
