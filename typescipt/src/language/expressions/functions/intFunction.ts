import {SingleArgumentFunction} from "./singleArgumentFunction";
import {VariableType} from "../../types/variableType";
import {PrimitiveType} from "../../types/PrimitiveType";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {ExpressionFunction} from "./expressionFunction";

export class IntFunction extends SingleArgumentFunction {
   
   public readonly name: string = `INT`;
   public readonly nodeType = "IntFunction";

   protected override get functionHelp(): string {
      return `{Name} expects 1 argument (Value)`;
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
     return new IntFunction(expression, reference);
   }
}
