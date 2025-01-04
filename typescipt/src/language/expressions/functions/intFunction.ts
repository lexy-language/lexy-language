import {SingleArgumentFunction} from "./singleArgumentFunction";
import {PrimitiveType} from "../../variableTypes/PrimitiveType";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {ExpressionFunction} from "./expressionFunction";

export function instanceOfIntFunction(object: any): object is IntFunction {
   return object?.nodeType == 'IntFunction';
}

export function asIntFunction(object: any): IntFunction | null {
   return instanceOfIntFunction(object) ? object as IntFunction : null;
}

export class IntFunction extends SingleArgumentFunction {
   
   public static name: string = `INT`;
   public readonly nodeType = "IntFunction";

   protected override get functionHelp(): string {
      return `${IntFunction.name} expects 1 argument (Value)`;
   }

   constructor(valueExpression: Expression, reference: SourceReference) {
     super(valueExpression, reference, PrimitiveType.number, PrimitiveType.number);
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new IntFunction(expression, reference);
   }
}
