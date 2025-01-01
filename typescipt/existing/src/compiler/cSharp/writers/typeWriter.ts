



namespace Lexy.Compiler.Compiler.CSharp.Writers;

internal class TypeWriter : IRootTokenWriter
{
   public GeneratedClass CreateCode(IRootNode node)
   {
     if (node is not TypeDefinition typeDefinition) throw new InvalidOperationException("Root token not table");

     var className = ClassNames.TypeClassName(typeDefinition.Name.Value);

     var classDeclaration = VariableClassFactory.TranslateVariablesClass(className, typeDefinition.Variables);

     return new GeneratedClass(node, className, classDeclaration);
   }
}
