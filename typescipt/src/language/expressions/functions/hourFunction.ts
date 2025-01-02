import {SingleArgumentFunction} from "./singleArgumentFunction";
import {VariableType} from "../../types/variableType";
import {PrimitiveType} from "../../types/primitiveType";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {ExpressionFunction} from "./expressionFunction";

export class HourFunction extends SingleArgumentFunction {

   public readonly nodeType = "HourFunction";
   public readonly name = `HOUR`;

   protected override get functionHelp() {
      return `'{Name} expects 1 argument (Date)`;
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
     return new HourFunction(expression, reference);
   }
}
