export class DependencyNode {
  private readonly dependenciesValue: Array<DependencyNode> = [];
  private readonly parentNode: DependencyNode | null;

  public name: string
  public type: string

  public get dependencies(): ReadonlyArray<DependencyNode> {
    return [...this.dependenciesValue];
  }

  constructor(name: string, type: string, parentNode: DependencyNode | null) {
    this.name = name;
    this.type = type;
    this.parentNode = parentNode;
  }

  public addDependency(dependency: DependencyNode): void {
    this.dependenciesValue.push(dependency);
  }

  protected equals(other: DependencyNode): boolean {
    return this.name == other.name && this.type == other.type;
  }

  public existsInLineage(name: string, type: string): boolean {
    if (this.name == name && this.type == type) return true;
    return this.parentNode != null && this.parentNode.existsInLineage(name, type);
  }
}
