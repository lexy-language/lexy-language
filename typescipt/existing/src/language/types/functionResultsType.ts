


namespace Lexy.Compiler.Language.Types;

public class FunctionResultsType : ComplexTypeReference
{
   public string FunctionName { get; }
   public ComplexType ComplexType { get; }

   public FunctionResultsType(string functionName, ComplexType complexType) : base(functionName)
   {
     FunctionName = functionName ?? throw new ArgumentNullException(nameof(functionName));
     ComplexType = complexType;
   }

   public override ComplexType GetComplexType(IValidationContext context)
   {
     return ComplexType;
   }

   public override VariableType MemberType(string name, IValidationContext context)
   {
     return ComplexType.MemberType(name, context);
   }
}
