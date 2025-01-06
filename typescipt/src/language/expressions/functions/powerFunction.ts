import {ExpressionFunction} from './expressionFunction';
import {Expression} from '../expression';
import {SourceReference} from "../../../parser/sourceReference";
import {INode} from "../../node";
import {IValidationContext} from "../../../parser/validationContext";
import {PrimitiveType} from "../../variableTypes/primitiveType";
import {VariableType} from "../../variableTypes/variableType";
import {NodeType} from "../../nodeType";

export class PowerFunction extends ExpressionFunction {

  public static readonly name: string = `POWER`;

  private get functionHelp() {
    return `${PowerFunction.name} expects 2 arguments (Number, Power).`;
  }

  public readonly nodeType = NodeType.PowerFunction;
  public numberExpression: Expression;
  public powerExpression: Expression;

  constructor(numberExpression: Expression, powerExpression: Expression, reference: SourceReference) {
    super(reference);
    this.numberExpression = numberExpression;
    this.powerExpression = powerExpression;
  }

  public override getChildren(): Array<INode> {
    return [
      this.numberExpression,
      this.powerExpression
    ]
  }

  protected override validate(context: IValidationContext): void {
    context
      .validateType(this.numberExpression, 1, `Number`, PrimitiveType.number, this.reference, this.functionHelp)
      .validateType(this.powerExpression, 2, `Power`, PrimitiveType.number, this.reference, this.functionHelp);
  }

  public override deriveReturnType(context: IValidationContext): VariableType {
    return PrimitiveType.number;
  }

  public static create(reference: SourceReference, numberExpression: Expression,
                       powerExpression: Expression): ExpressionFunction {
    return new PowerFunction(numberExpression, powerExpression, reference);
  }
}
