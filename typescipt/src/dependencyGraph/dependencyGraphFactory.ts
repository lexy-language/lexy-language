

export class DependencyGraphFactory {
   public static create(rootNodes: RootNodeList): Dependencies {
     if (rootNodes == null) throw new Error(nameof(rootNodes));

     let dependencies = new Dependencies(rootNodes);
     dependencies.Build();
     return dependencies;
   }
}
