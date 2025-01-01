

export class TypeWithMembers extends VariableType, ITypeWithMembers {
   public abstract memberType(name: string, context: IValidationContext): VariableType;
}
