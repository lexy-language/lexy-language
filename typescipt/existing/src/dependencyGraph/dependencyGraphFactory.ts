


namespace Lexy.Compiler.DependencyGraph;

public static class DependencyGraphFactory
{
   public static Dependencies Create(RootNodeList rootNodes)
   {
     if (rootNodes = null) throw new ArgumentNullException(nameof(rootNodes));

     var dependencies = new Dependencies(rootNodes);
     dependencies.Build();
     return dependencies;
   }
}
