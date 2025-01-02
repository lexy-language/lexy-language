import {SingleArgumentFunction} from "./singleArgumentFunction";
import {VariableType} from "../../types/variableType";
import {PrimitiveType} from "../../types/primitiveType";
import {SourceReference} from "../../../parser/sourceReference";
import {Expression} from "../expression";
import {ExpressionFunction} from "./expressionFunction";

export class AbsFunction extends SingleArgumentFunction {

   public readonly nodeType = "AbsFunction";
   public readonly name = `ABS`;

   protected override get functionHelp(): string {
      return `${this.name} expects 1 argument (Value)`;
   }

   protected override get argumentType(): VariableType {
      return PrimitiveType.number;
   }

   protected override get resultType(): VariableType {
      return PrimitiveType.number;
   }

   constructor(valueExpression: Expression, reference: SourceReference) {
     super(valueExpression, reference);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new AbsFunction(expression, reference);
   }
}
