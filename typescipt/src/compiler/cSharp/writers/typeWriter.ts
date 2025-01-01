

export class TypeWriter extends IRootTokenWriter {
   public createCode(node: IRootNode): GeneratedClass {
     if (node is not TypeDefinition typeDefinition) throw new Error(`Root token not table`);

     let className = ClassNames.TypeClassName(typeDefinition.Name.Value);

     let classDeclaration = VariableClassFactory.TranslateVariablesClass(className, typeDefinition.Variables);

     return new GeneratedClass(node, className, classDeclaration);
   }
}
