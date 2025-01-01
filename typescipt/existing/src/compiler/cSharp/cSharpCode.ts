







namespace Lexy.Compiler.Compiler.CSharp;

internal static class CSharpCode
{
   public static IRootTokenWriter GetWriter(IRootNode rootNode)
   {
     return rootNode switch
     {
       Function _ => new FunctionWriter(),
       EnumDefinition _ => new EnumWriter(),
       Table _ => new TableWriter(),
       TypeDefinition _ => new TypeWriter(),
       Scenario _ => null,
       _ => throw new InvalidOperationException("No writer defined: " + rootNode.GetType())
     };
   }
}
