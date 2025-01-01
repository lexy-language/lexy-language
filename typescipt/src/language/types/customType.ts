

export class CustomType extends TypeWithMembers {
   public string Type
   public TypeDefinition TypeDefinition

   constructor(type: string, typeDefinition: TypeDefinition) {
     Type = type;
     TypeDefinition = typeDefinition;
   }

   protected equals(other: TableType): boolean {
     return Type == other.Type;
   }

   public override equals(obj: object): boolean {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() != GetType()) return false;
     return Equals((TableType)obj);
   }

   public override getHashCode(): number {
     return Type != null ? Type.GetHashCode() : 0;
   }

   public override toString(): string {
     return Type;
   }

   public override memberType(name: string, context: IValidationContext): VariableType {
     let definition = TypeDefinition.Variables.FirstOrDefault(variable => variable.Name == name);
     return definition?.Type.createVariableType(context);
   }
}
