

export class ExpressionFunction extends Node {
   protected ExpressionFunction(SourceReference reference) {
     super(reference);
   }

   public abstract deriveReturnType(context: IValidationContext): VariableType;
}
