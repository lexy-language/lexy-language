


namespace Lexy.Compiler.Language.Types;

public class FunctionParametersType : ComplexTypeReference
{
   public string FunctionName { get; }
   public ComplexType ComplexType { get; }

   public FunctionParametersType(string functionName, ComplexType complexType) : base(functionName)
   {
     FunctionName = functionName ?? throw new ArgumentNullException(nameof(functionName));
     ComplexType = complexType ?? throw new ArgumentNullException(nameof(complexType));
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
