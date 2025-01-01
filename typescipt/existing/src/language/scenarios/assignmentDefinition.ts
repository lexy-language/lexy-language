






namespace Lexy.Compiler.Language.Scenarios;

public class AssignmentDefinition : Node
{
   private readonly Expression valueExpression;
   private readonly Expression variableExpression;

   public ConstantValue ConstantValue { get; }
   public VariableReference Variable { get; }

   public VariableType VariableType { get; private set; }

   private AssignmentDefinition(VariableReference variable, ConstantValue constantValue, Expression variableExpression,
     Expression valueExpression, SourceReference reference)
     : base(reference)
   {
     Variable = variable;
     ConstantValue = constantValue;

     this.variableExpression = variableExpression;
     this.valueExpression = valueExpression;
   }

   public static AssignmentDefinition Parse(IParseLineContext context)
   {
     var line = context.Line;
     var tokens = line.Tokens;
     var reference = line.LineStartReference();

     var assignmentIndex = tokens.Find<OperatorToken>(token => token.Type = OperatorType.Assignment);
     if (assignmentIndex < 0 | assignmentIndex = tokens.Length - 1)
     {
       context.Logger.Fail(reference, "Invalid assignment. Expected: 'Variable = Value'");
       return null;
     }

     var targetExpression =
       ExpressionFactory.Parse(tokens.TokensFromStart(assignmentIndex), line);
     if (context.Failed(targetExpression, reference)) return null;

     var valueExpression =
       ExpressionFactory.Parse(tokens.TokensFrom(assignmentIndex + 1), line);
     if (context.Failed(valueExpression, reference)) return null;

     var variableReference = VariableReferenceParser.Parse(targetExpression.Result);
     if (context.Failed(variableReference, reference)) return null;

     var constantValue = ConstantValue.Parse(valueExpression.Result);
     if (context.Failed(constantValue, reference)) return null;

     return new AssignmentDefinition(variableReference.Result, constantValue.Result, targetExpression.Result,
       valueExpression.Result, reference);
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return variableExpression;
     yield return valueExpression;
   }

   protected override void Validate(IValidationContext context)
   {
     if (!context.VariableContext.Contains(Variable, context))
       //logger by IdentifierExpressionValidation
       return;

     var expressionType = valueExpression.DeriveType(context);

     VariableType = context.VariableContext.GetVariableType(Variable, context);
     if (expressionType ! null & !expressionType.Equals(VariableType))
       context.Logger.Fail(Reference,
         $"Variable '{Variable}' of type '{VariableType}' is not assignable from expression of type '{expressionType}'.");
   }
}
