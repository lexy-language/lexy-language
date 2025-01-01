

export class EnumWriter extends IRootTokenWriter {
   public createCode(node: IRootNode): GeneratedClass {
     if (!(node is EnumDefinition enumDefinition)) throw new Error(`Root token not Function`);

     let className = ClassNames.EnumClassName(enumDefinition.Name.Value);
     let members = WriteValues(enumDefinition);

     let enumNode = EnumDeclaration(className)
       .WithMembers(SeparatedArray<EnumMemberDeclarationSyntax>(members))
       .WithModifiers(Modifiers.Public());

     return new GeneratedClass(enumDefinition, className, enumNode);
   }

   private SyntaxNodeOrToken[writeValues(enumDefinition: EnumDefinition): ] {
     let result = new Array<SyntaxNodeOrToken>();
     foreach (let value in enumDefinition.Members) {
       if (result.Count > 0) result.Add(Token(SyntaxKind.CommaToken));

       let declaration = EnumMemberDeclaration(value.Name)
         .WithEqualsValue(
           EqualsValueClause(
             LiteralExpression(SyntaxKind.NumericLiteralExpression,
               Literal(value.NumberValue))));

       result.Add(declaration);
     }

     return result.ToArray();
   }
}
