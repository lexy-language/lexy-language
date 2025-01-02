

export class FunctionResultsType extends ComplexTypeReference {
   public string functionName
   public ComplexType ComplexType

   public FunctionResultsType(string functionName, ComplexType complexType) super(functionName) {
     functionName = functionName ?? throw new Error(nameof(functionName));
     ComplexType = complexType;
   }

   public override getComplexType(context: IValidationContext): ComplexType {
     return ComplexType;
   }

   public override memberType(name: string, context: IValidationContext): VariableType {
     return ComplexType.MemberType(name, context);
   }
}
