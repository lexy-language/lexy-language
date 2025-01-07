import {SingleArgumentFunction} from "./singleArgumentFunction";
import {SourceReference} from "../../../parser/sourceReference";
import {Expression} from "../expression";
import {ExpressionFunction} from "./expressionFunction";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {NodeType} from "../../nodeType";

export class YearFunction extends SingleArgumentFunction {

   public static readonly name: string = `YEAR`;
   public readonly nodeType = NodeType.YearFunction;

   protected override get functionHelp(): string {
      return `'{Name} expects 1 argument (Date)`;
   }

   constructor(valueExpression: Expression, reference: SourceReference) {
      super(valueExpression, reference, PrimitiveType.date, PrimitiveType.number);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new YearFunction(expression, reference);
   }
}
