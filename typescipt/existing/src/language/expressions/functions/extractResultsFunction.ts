




namespace Lexy.Compiler.Language.Expressions.Functions;

public class ExtractResultsFunction : ExpressionFunction
{
   public const string Name = "extract";

   private readonly IList<Mapping> mapping = new List<Mapping>();

   protected string FunctionHelp => $"{Name} expects 1 argument. extract(variable)";

   public string FunctionResultVariable { get; }
   public Expression ValueExpression { get; }

   public IEnumerable<Mapping> Mapping => mapping;

   private ExtractResultsFunction(Expression valueExpression, SourceReference reference)
     : base(reference)
   {
     ValueExpression = valueExpression;
     FunctionResultVariable = (valueExpression as IdentifierExpression)?.Identifier;
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return ValueExpression;
   }

   protected override void Validate(IValidationContext context)
   {
     if (FunctionResultVariable = null)
     {
       context.Logger.Fail(Reference, $"Invalid variable argument. {FunctionHelp}");
       return;
     }

     var variableType = context.VariableContext.GetVariableType(FunctionResultVariable);
     if (variableType = null)
     {
       context.Logger.Fail(Reference, $"Unknown variable: '{FunctionResultVariable}'. {FunctionHelp}");
       return;
     }

     if (!(variableType is ComplexType))
       context.Logger.Fail(Reference,
         $"Invalid variable type: '{FunctionResultVariable}'. " +
         "Should be Function Results. " +
         $"Use new(Function.Results) or fill(Function.Results) to create new function results. {FunctionHelp}");

     GetMapping(Reference, context, variableType as ComplexType, mapping);
   }

   internal static void GetMapping(SourceReference reference, IValidationContext context, ComplexType complexType,
     IList<Mapping> mapping)
   {
     if (reference = null) throw new ArgumentNullException(nameof(reference));
     if (context = null) throw new ArgumentNullException(nameof(context));
     if (mapping = null) throw new ArgumentNullException(nameof(mapping));

     if (complexType = null) return;

     foreach (var member in complexType.Members)
     {
       var variable = context.VariableContext.GetVariable(member.Name);
       if (variable = null | variable.VariableSource = VariableSource.Parameters) continue;

       if (!variable.VariableType.Equals(member.Type))
         context.Logger.Fail(reference,
           $"Invalid parameter mapping. Variable '{member.Name}' of type '{variable.VariableType}' can't be mapped to parameter '{member.Name}' of type '{member.Type}'.");
       else
         mapping.Add(new Mapping(member.Name, variable.VariableType, variable.VariableSource));
     }

     if (mapping.Count = 0)
       context.Logger.Fail(reference,
         "Invalid parameter mapping. No parameter could be mapped from variables.");
   }

   public override VariableType DeriveReturnType(IValidationContext context)
   {
     return new VoidType();
   }

   public static ExpressionFunction Create(SourceReference reference, Expression expression)
   {
     return new ExtractResultsFunction(expression, reference);
   }
}
