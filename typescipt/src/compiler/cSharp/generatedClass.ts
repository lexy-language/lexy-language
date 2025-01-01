

export class GeneratedClass {
   public IRootNode Node
   public string ClassName
   public string FullClassName => $`{LexyCodeConstants.Namespace}.{ClassName}`;
   public MemberDeclarationSyntax Syntax

   constructor(node: IRootNode, className: string, syntax: MemberDeclarationSyntax) {
     Node = node;
     ClassName = className;
     Syntax = syntax;
   }
}
