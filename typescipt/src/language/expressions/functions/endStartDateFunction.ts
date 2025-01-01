

export class EndStartDateFunction extends ExpressionFunction {
   private string FunctionHelp => $`'{FunctionName}' expects 2 arguments (EndDate, StartDate).`;

   protected abstract string FunctionName

   public Expression EndDateExpression
   public Expression StartDateExpression

   protected EndStartDateFunction(Expression endDateExpression, Expression startDateExpression,
     SourceReference reference)
     : base(reference) {
     EndDateExpression = endDateExpression;
     StartDateExpression = startDateExpression;
   }

   public override getChildren(): Array<INode> {
     yield return EndDateExpression;
     yield return StartDateExpression;
   }

   protected override validate(context: IValidationContext): void {
     context
       .ValidateType(EndDateExpression, 1, `EndDate`, PrimitiveType.Date, Reference, FunctionHelp)
       .ValidateType(StartDateExpression, 2, `EndDate`, PrimitiveType.Date, Reference, FunctionHelp);
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return PrimitiveType.Number;
   }
}
