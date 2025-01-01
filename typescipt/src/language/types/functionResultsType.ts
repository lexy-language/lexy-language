

export class FunctionResultsType extends ComplexTypeReference {
   public string FunctionName
   public ComplexType ComplexType

   public FunctionResultsType(string functionName, ComplexType complexType) : base(functionName) {
     FunctionName = functionName ?? throw new Error(nameof(functionName));
     ComplexType = complexType;
   }

   public override getComplexType(context: IValidationContext): ComplexType {
     return ComplexType;
   }

   public override memberType(name: string, context: IValidationContext): VariableType {
     return ComplexType.MemberType(name, context);
   }
}
