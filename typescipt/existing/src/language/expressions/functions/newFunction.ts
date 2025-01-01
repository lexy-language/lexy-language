





namespace Lexy.Compiler.Language.Expressions.Functions;

public class NewFunction : ExpressionFunction, IHasNodeDependencies
{
   public const string Name = "new";

   protected string FunctionHelp => $"{Name} expects 1 argument (Function.Parameters)";

   public MemberAccessLiteral TypeLiteral { get; }

   public Expression ValueExpression { get; }

   public ComplexTypeReference Type { get; private set; }

   private NewFunction(Expression valueExpression, SourceReference reference)
     : base(reference)
   {
     ValueExpression = valueExpression ?? throw new ArgumentNullException(nameof(valueExpression));
     TypeLiteral = (valueExpression as MemberAccessExpression)?.MemberAccessLiteral;
   }

   public IEnumerable<IRootNode> GetDependencies(RootNodeList rootNodeList)
   {
     if (Type ! null) yield return rootNodeList.GetNode(Type.Name);
   }

   public static ExpressionFunction Create(SourceReference reference, Expression expression)
   {
     return new NewFunction(expression, reference);
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return ValueExpression;
   }

   protected override void Validate(IValidationContext context)
   {
     var valueType = ValueExpression.DeriveType(context);
     if (!(valueType is ComplexTypeReference complexTypeReference))
     {
       context.Logger.Fail(Reference,
         $"Invalid argument 1 'Value' should be of type 'ComplexTypeType' but is 'ValueType'. {FunctionHelp}");
       return;
     }

     Type = complexTypeReference;
   }

   public override VariableType DeriveReturnType(IValidationContext context)
   {
     var nodeType = context.RootNodes.GetType(TypeLiteral.Parent);
     var typeReference = nodeType?.MemberType(TypeLiteral.Member, context) as ComplexTypeReference;
     return typeReference?.GetComplexType(context);
   }
}
