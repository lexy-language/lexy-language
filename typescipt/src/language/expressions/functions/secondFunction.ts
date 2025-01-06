import {SingleArgumentFunction} from "./singleArgumentFunction";
import {SourceReference} from "../../../parser/sourceReference";
import {Expression} from "../expression";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {ExpressionFunction} from "./expressionFunction";
import {NodeType} from "../../nodeType";

export class SecondFunction extends SingleArgumentFunction {
   public static readonly name: string = `SECOND`;

   protected override get functionHelp(): string {
      return `'${SecondFunction.name} expects 1 argument (Date)`;
   }

   public readonly nodeType = NodeType.SecondFunction;

   constructor(valueExpression: Expression, reference: SourceReference) {
      super(valueExpression, reference, PrimitiveType.date, PrimitiveType.number);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new SecondFunction(expression, reference);
   }
}
