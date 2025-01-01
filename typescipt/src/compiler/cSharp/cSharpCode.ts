

internal static class CSharpCode {
   public static getWriter(rootNode: IRootNode): IRootTokenWriter {
     return rootNode switch {
       Function _ => new FunctionWriter(),
       EnumDefinition _ => new EnumWriter(),
       Table _ => new TableWriter(),
       TypeDefinition _ => new TypeWriter(),
       Scenario _ => null,
       _ => throw new Error(`No writer defined: ` + rootNode.GetType())
     };
   }
}
