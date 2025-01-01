

export class ExpressionFunction extends Node {
   protected ExpressionFunction(SourceReference reference) : base(reference) {
   }

   public abstract deriveReturnType(context: IValidationContext): VariableType;
}
