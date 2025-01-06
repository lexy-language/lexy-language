import {ExpressionFunction} from "./expressionFunction";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {INode} from "../../node";
import {IValidationContext} from "../../../parser/validationContext";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {VariableType} from "../../variableTypes/variableType";
import {NodeType} from "../../nodeType";

export abstract class EndStartDateFunction extends ExpressionFunction {
   private get functionHelp() {
     return `'${this.functionName}' expects 2 arguments (EndDate, StartDate).`;
   }

  protected abstract functionName: string

  public endDateExpression: Expression;
  public startDateExpression: Expression;

  constructor(endDateExpression: Expression, startDateExpression: Expression,
     reference: SourceReference) {
     super(reference);
     this.endDateExpression = endDateExpression;
     this.startDateExpression = startDateExpression;
   }

   public override getChildren(): Array<INode> {
     return [this.endDateExpression, this.startDateExpression];
   }

   protected override validate(context: IValidationContext): void {
     context
       .validateType(this.endDateExpression, 1, `EndDate`, PrimitiveType.date, this.reference, this.functionHelp)
       .validateType(this.startDateExpression, 2, `StartDate`, PrimitiveType.date, this.reference, this.functionHelp);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return PrimitiveType.number;
   }
}
