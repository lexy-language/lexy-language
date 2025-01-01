

export class PrimitiveType extends VariableType {
   public static PrimitiveType Boolean =new(): >;
   public static PrimitiveType String =new(): >;
   public static PrimitiveType Number =new(): >;
   public static PrimitiveType Date =new(): >;

   public string Type

   constructor(type: string) {
     Type = type;
   }

   protected equals(other: PrimitiveType): boolean {
     return Type == other.Type;
   }

   public override equals(obj: object): boolean {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() != GetType()) return false;
     return Equals((PrimitiveType)obj);
   }

   public override getHashCode(): number {
     return Type != null ? Type.GetHashCode() : 0;
   }

   public override toString(): string {
     return Type;
   }
}
