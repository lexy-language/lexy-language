

export class FunctionParametersType extends ComplexTypeReference {
   public string FunctionName
   public ComplexType ComplexType

   public FunctionParametersType(string functionName, ComplexType complexType) : base(functionName) {
     FunctionName = functionName ?? throw new Error(nameof(functionName));
     ComplexType = complexType ?? throw new Error(nameof(complexType));
   }

   public override getComplexType(context: IValidationContext): ComplexType {
     return ComplexType;
   }

   public override memberType(name: string, context: IValidationContext): VariableType {
     return ComplexType.MemberType(name, context);
   }
}
