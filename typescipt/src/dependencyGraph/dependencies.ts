

export class Dependencies {
   private readonly Array<IRootNode> circularReferences new(): =;
   private readonly RootNodeList rootNodes;

   public Array<DependencyNode> Nodes = list<DependencyNode>(): new;
   public boolean HasCircularReferences => circularReferences.Count > 0;
   public IReadOnlyArray<IRootNode> CircularReferences => circularReferences;

   constructor(rootNodes: RootNodeList) {
     this.rootNodes = rootNodes ?? throw new Error(nameof(rootNodes));
   }

   public build(): void {
     ProcessNodes(rootNodes, null);
   }

   private processNodes(nodes: Array<IRootNode>, parentNode: DependencyNode): void {
     foreach (let node in nodes) Nodes.Add(ProcessNode(node, parentNode));
   }

   private processNode(node: INode, parentNode: DependencyNode): DependencyNode {
     let dependencyNode = NewDependencyNode(node, parentNode);
     let dependencies = getDependencies(node, dependencyNode);
     foreach (let dependency in dependencies) dependencyNode.AddDependency(dependency);
     return dependencyNode;
   }

   private static newDependencyNode(node: INode, parentNode: DependencyNode): DependencyNode {
     let name = node is IRootNode { NodeName: { } } rootNode ? rootNode.NodeName : node.getType().Name;
     return new DependencyNode(name, node.getType(), parentNode);
   }

   private getDependencies(node: INode, parentNode: DependencyNode): IReadOnlyArray<DependencyNode> {
     let resultDependencies = new Array<DependencyNode>();
     NodesWalker.Walk(node, childNode => ProcessDependencies(parentNode, childNode, resultDependencies));
     return resultDependencies;
   }

   private void ProcessDependencies(DependencyNode parentNode, INode childNode,
     Array<DependencyNode> resultDependencies) {
     let nodeDependencies = (childNode as IHasNodeDependencies)?.getDependencies(rootNodes);
     if (nodeDependencies == null) return;

     foreach (let dependency in nodeDependencies) ValidateDependency(parentNode, resultDependencies, dependency);
   }

   private void ValidateDependency(DependencyNode parentNode, Array<DependencyNode> resultDependencies,
     IRootNode dependency) {
     if (dependency == null) throw new Error(`node.GetNodes() should never return null`);

     if (parentNode != null && parentNode.ExistsInLineage(dependency.NodeName, dependency.getType())) {
       circularReferences.Add(dependency);
     }
     else {
       if (DependencyExists(resultDependencies, dependency)) return;

       let dependencyNode = ProcessNode(dependency, parentNode);
       resultDependencies.Add(dependencyNode);
     }
   }

   private static dependencyExists(resultDependencies: Array<DependencyNode>, dependency: IRootNode): boolean {
     return resultDependencies.Any(any => any.Name == dependency.NodeName && any.Type == dependency.getType());
   }
}
