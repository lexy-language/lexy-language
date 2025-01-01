

public sealed class PrimitiveVariableDeclarationType : VariableDeclarationType {
   public string Type

   public PrimitiveVariableDeclarationType(string type, SourceReference reference) : base(reference) {
     Type = type ?? throw new Error(nameof(type));
   }

   protected equals(other: PrimitiveVariableDeclarationType): boolean {
     return Type == other.Type;
   }

   public override equals(obj: object): boolean {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() != GetType()) return false;
     return Equals((PrimitiveVariableDeclarationType)obj);
   }

   public override getHashCode(): number {
     return Type != null ? Type.GetHashCode() : 0;
   }

   public override toString(): string {
     return Type;
   }

   public override createVariableType(context: IValidationContext): VariableType {
     return new PrimitiveType(Type);
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
   }
}
