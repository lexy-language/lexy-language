

export class NoArgumentFunction extends ExpressionFunction {
   protected abstract VariableType ResultType

   constructor(reference: SourceReference)
     {
     super(reference);
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return ResultType;
   }
}
