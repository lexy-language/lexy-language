import {SingleArgumentFunction} from "./singleArgumentFunction";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {SourceReference} from "../../../parser/sourceReference";
import {Expression} from "../expression";
import {ExpressionFunction} from "./expressionFunction";
import {NodeType} from "../../nodeType";

export class MinuteFunction extends SingleArgumentFunction {
   public static readonly name: string = `MINUTE`;

   public readonly nodeType = NodeType.MinuteFunction;

   protected override get functionHelp(): string {
      return `'${MinuteFunction.name} expects 1 argument (Date)`
   }

   constructor(valueExpression: Expression, reference: SourceReference) {
     super(valueExpression, reference, PrimitiveType.date, PrimitiveType.number);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new MinuteFunction(expression, reference);
   }
}
