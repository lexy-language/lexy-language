

export class ComplexTypeReference extends VariableType, ITypeWithMembers {
   public string Name

   constructor(name: string) {
     Name = name;
   }

   public abstract memberType(name: string, context: IValidationContext): VariableType;

   public abstract getComplexType(context: IValidationContext): ComplexType;
}
