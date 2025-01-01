

export class ComplexType extends VariableType, ITypeWithMembers {
   public string Name
   public ComplexTypeSource Source
   public Array<ComplexTypeMember> Members

   constructor(name: string, source: ComplexTypeSource, members: Array<ComplexTypeMember>) {
     Name = name;
     Source = source;
     Members = members;
   }

   public memberType(name: string, context: IValidationContext): VariableType {
     return Members.FirstOrDefault(member => member.Name == name)?.Type;
   }

   protected equals(other: ComplexType): boolean {
     return Name == other.Name && Source == other.Source;
   }

   public override equals(obj: object): boolean {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() != GetType()) return false;
     return Equals((ComplexType)obj);
   }

   public override getHashCode(): number {
     return HashCode.Combine(Name, (number)Source);
   }
}
