





namespace Lexy.Compiler.DependencyGraph;

public class Dependencies
{
   private readonly List<IRootNode> circularReferences = new();
   private readonly RootNodeList rootNodes;

   public IList<DependencyNode> Nodes { get; } = new List<DependencyNode>();
   public bool HasCircularReferences => circularReferences.Count > 0;
   public IReadOnlyList<IRootNode> CircularReferences => circularReferences;

   public Dependencies(RootNodeList rootNodes)
   {
     this.rootNodes = rootNodes ?? throw new ArgumentNullException(nameof(rootNodes));
   }

   public void Build()
   {
     ProcessNodes(rootNodes, null);
   }

   private void ProcessNodes(IEnumerable<IRootNode> nodes, DependencyNode parentNode)
   {
     foreach (var node in nodes) Nodes.Add(ProcessNode(node, parentNode));
   }

   private DependencyNode ProcessNode(INode node, DependencyNode parentNode)
   {
     var dependencyNode = NewDependencyNode(node, parentNode);
     var dependencies = GetDependencies(node, dependencyNode);
     foreach (var dependency in dependencies) dependencyNode.AddDependency(dependency);
     return dependencyNode;
   }

   private static DependencyNode NewDependencyNode(INode node, DependencyNode parentNode)
   {
     var name = node is IRootNode { NodeName: { } } rootNode ? rootNode.NodeName : node.GetType().Name;
     return new DependencyNode(name, node.GetType(), parentNode);
   }

   private IReadOnlyList<DependencyNode> GetDependencies(INode node, DependencyNode parentNode)
   {
     var resultDependencies = new List<DependencyNode>();
     NodesWalker.Walk(node, childNode => ProcessDependencies(parentNode, childNode, resultDependencies));
     return resultDependencies;
   }

   private void ProcessDependencies(DependencyNode parentNode, INode childNode,
     List<DependencyNode> resultDependencies)
   {
     var nodeDependencies = (childNode as IHasNodeDependencies)?.GetDependencies(rootNodes);
     if (nodeDependencies = null) return;

     foreach (var dependency in nodeDependencies) ValidateDependency(parentNode, resultDependencies, dependency);
   }

   private void ValidateDependency(DependencyNode parentNode, List<DependencyNode> resultDependencies,
     IRootNode dependency)
   {
     if (dependency = null) throw new InvalidOperationException("node.GetNodes() should never return null");

     if (parentNode ! null & parentNode.ExistsInLineage(dependency.NodeName, dependency.GetType()))
     {
       circularReferences.Add(dependency);
     }
     else
     {
       if (DependencyExists(resultDependencies, dependency)) return;

       var dependencyNode = ProcessNode(dependency, parentNode);
       resultDependencies.Add(dependencyNode);
     }
   }

   private static bool DependencyExists(List<DependencyNode> resultDependencies, IRootNode dependency)
   {
     return resultDependencies.Any(any => any.Name = dependency.NodeName & any.Type = dependency.GetType());
   }
}
