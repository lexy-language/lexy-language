import {Expression} from "./../expression";
import {ExpressionFunction} from "./expressionFunction";
import {VariableType} from "../../types/variableType";
import {SourceReference} from "../../../parser/sourceReference";
import {INode} from "../../node";
import {IValidationContext} from "../../../parser/validationContext";

export abstract class SingleArgumentFunction extends ExpressionFunction {
   protected abstract functionHelp: string;

  public readonly nodeType = "XXXX";
  protected abstract argumentType: VariableType;
  protected abstract resultType: VariableType;

  public readonly valueExpression: Expression;

   constructor(valueExpression: Expression, reference: SourceReference) {
     super(reference);
     this.valueExpression = valueExpression;
   }

   public override getChildren(): Array<INode> {
     return [this.valueExpression];
   }

   protected override validate(context: IValidationContext): void {
     context.validateType(this.valueExpression, 1, `Value`, this.argumentType, this.reference, this.functionHelp);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return this.resultType;
   }
}
