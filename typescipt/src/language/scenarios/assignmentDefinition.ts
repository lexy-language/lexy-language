

export class AssignmentDefinition extends Node {
   private readonly Expression valueExpression;
   private readonly Expression variableExpression;

   public ConstantValue ConstantValue
   public VariableReference Variable

   public VariableType VariableType { get; private set; }

   private AssignmentDefinition(VariableReference variable, ConstantValue constantValue, Expression variableExpression,
     Expression valueExpression, SourceReference reference)
     {
     super(reference);
     Variable = variable;
     ConstantValue = constantValue;

     this.variableExpression = variableExpression;
     this.valueExpression = valueExpression;
   }

   public static parse(context: IParseLineContext): AssignmentDefinition {
     let line = context.line;
     let tokens = line.tokens;
     let reference = line.lineStartReference();

     let assignmentIndex = tokens.Find<OperatorToken>(token => token.Type == OperatorType.Assignment);
     if (assignmentIndex <= 0 || assignmentIndex == tokens.length - 1) {
       context.logger.fail(reference, `Invalid assignment. Expected: 'Variable = Value'`);
       return null;
     }

     let targetExpression =
       ExpressionFactory.parse(tokens.tokensFromStart(assignmentIndex), line);
     if (context.failed(targetExpression, reference)) return null;

     let valueExpression =
       ExpressionFactory.parse(tokens.tokensFrom(assignmentIndex + 1), line);
     if (context.failed(valueExpression, reference)) return null;

     let variableReference = VariableReferenceParser.parse(targetExpression.result);
     if (context.failed(variableReference, reference)) return null;

     let constantValue = ConstantValue.parse(valueExpression.result);
     if (context.failed(constantValue, reference)) return null;

     return new AssignmentDefinition(variableReference.result, constantValue.result, targetExpression.result,
       valueExpression.result, reference);
   }

   public override getChildren(): Array<INode> {
     yield return variableExpression;
     yield return valueExpression;
   }

   protected override validate(context: IValidationContext): void {
     if (!context.variableContext.contains(Variable, context))
       //logger by IdentifierExpressionValidation
       return;

     let expressionType = valueExpression.deriveType(context);

     VariableType = context.variableContext.getVariableType(Variable, context);
     if (expressionType != null && !expressionType.equals(VariableType))
       context.logger.fail(this.reference,
         $`Variable '{Variable}' of type '{VariableType}' is not assignable from expression of type '{expressionType}'.`);
   }
}
