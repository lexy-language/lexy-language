import {VariableType} from "../../types/variableType";
import {PrimitiveType} from "../../types/primitiveType";
import {SingleArgumentFunction} from "./singleArgumentFunction";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {ExpressionFunction} from "./expressionFunction";

export class DayFunction extends SingleArgumentFunction {

   public readonly nodeType = `DayFunction`;
   public readonly name = `DAY`;

   protected override get functionHelp(): string {
      return `${this.name} expects 1 argument (Date)`;
   }

   protected override get argumentType(): VariableType {
      return PrimitiveType.date;
   }

   protected override get resultType(): VariableType {
      return PrimitiveType.number;
   }

   constructor(valueExpression: Expression, reference: SourceReference) {
      super(valueExpression, reference);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new DayFunction(expression, reference);
   }
}
