

export class DependencyNode {
   private readonly Array<DependencyNode> dependencies new(): =;
   private readonly DependencyNode parentNode;

   public string Name
   public Type Type

   public IReadOnlyArray<DependencyNode> Dependencies => dependencies;

   constructor(name: string, type: Type, parentNode: DependencyNode) {
     Name = name ?? throw new Error(nameof(name));
     Type = type ?? throw new Error(nameof(type));
     this.parentNode = parentNode;
   }

   public addDependency(dependency: DependencyNode): void {
     dependencies.Add(dependency);
   }

   protected equals(other: DependencyNode): boolean {
     return Name == other.Name && Equals(Type, other.Type);
   }

   public override equals(obj: object): boolean {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() != GetType()) return false;
     return Equals((DependencyNode)obj);
   }

   public override getHashCode(): number {
     return HashCode.Combine(Name, Type);
   }

   public existsInLineage(name: string, type: Type): boolean {
     if (Name == name && Type == type) return true;
     return parentNode != null && parentNode.ExistsInLineage(name, type);
   }
}
