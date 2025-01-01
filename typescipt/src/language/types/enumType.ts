

export class EnumType extends TypeWithMembers {
   public string Type
   public EnumDefinition Enum

   constructor(type: string, enumDefinition: EnumDefinition) {
     Type = type;
     Enum = enumDefinition;
   }

   protected equals(other: EnumType): boolean {
     return Type == other.Type;
   }

   public override equals(obj: object): boolean {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() != GetType()) return false;
     return Equals((EnumType)obj);
   }

   public override getHashCode(): number {
     return Type != null ? Type.GetHashCode() : 0;
   }

   public override toString(): string {
     return Type;
   }

   public override memberType(name: string, context: IValidationContext): VariableType {
     return Enum.Members.Any(member => member.Name == name) ? this : null;
   }
}
