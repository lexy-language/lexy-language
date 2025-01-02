import {ExpressionFunction} from "./expressionFunction";
import {VariableType} from "../../types/variableType";
import {SourceReference} from "../../../parser/sourceReference";
import {INode} from "../../node";
import {IValidationContext} from "../../../parser/validationContext";

export abstract class NoArgumentFunction extends ExpressionFunction {

  protected abstract resultType: VariableType;

  constructor(reference: SourceReference){
   super(reference);
 }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return this.resultType;
   }
}
