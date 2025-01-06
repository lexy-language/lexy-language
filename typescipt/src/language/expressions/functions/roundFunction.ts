import {SourceReference} from "../../../parser/sourceReference";
import {INode} from "../../node";
import {IValidationContext} from "../../../parser/validationContext";
import {ExpressionFunction} from "./expressionFunction";
import {Expression} from "../expression";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {VariableType} from "../../variableTypes/variableType";
import {NodeType} from "../../nodeType";

export class RoundFunction extends ExpressionFunction {
   public static readonly name: string = `ROUND`;

   private get functionHelp() {
     return `'${RoundFunction.name}' expects 2 arguments (Number, Digits).`;
   }

  public readonly nodeType = NodeType.RoundFunction;
  public numberExpression: Expression;
  public digitsExpression: Expression;

  constructor(numberExpression: Expression, digitsExpression: Expression, reference: SourceReference) {
     super(reference);
     this.numberExpression = numberExpression;
     digitsExpression = digitsExpression;
   }

   public override getChildren(): Array<INode> {
    return [
      this.numberExpression,
      this.digitsExpression
    ];
   }

   protected override validate(context: IValidationContext): void {
     context
       .validateType(this.numberExpression, 1, `Number`, PrimitiveType.number, this.reference, this.functionHelp)
       .validateType(this.digitsExpression, 2, `Digits`, PrimitiveType.number, this.reference, this.functionHelp);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return PrimitiveType.number;
   }

   public static create(reference: SourceReference, numberExpression: Expression, powerExpression: Expression): ExpressionFunction {
     return new RoundFunction(numberExpression, powerExpression, reference);
   }
}
