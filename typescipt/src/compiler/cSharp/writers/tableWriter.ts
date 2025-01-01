

export class TableWriter extends IRootTokenWriter {
   public createCode(node: IRootNode): GeneratedClass {
     if (!(node is Table table)) throw new Error(`Root token not table`);

     let className = ClassNames.TableClassName(table.Name.Value);

     let members = new Array<MemberDeclarationSyntax>();
     members.Add(GenerateRowClass(LexyCodeConstants.RowType, table));
     members.Add(GenerateFields(LexyCodeConstants.RowType));
     members.Add(GenerateStaticConstructor(className, table, LexyCodeConstants.RowType));
     members.AddRange(GenerateProperties(LexyCodeConstants.RowType));

     let classDeclaration = ClassDeclaration(className)
       .WithModifiers(Modifiers.Public())
       .WithMembers(List(members));

     return new GeneratedClass(node, className, classDeclaration);
   }

   private static generateRowClass(rowName: string, table: Table): ClassDeclarationSyntax {
     let fields = Array<MemberDeclarationSyntax>(
       table.Header.Columns
         .Select(Field));

     let rowClassDeclaration = ClassDeclaration(rowName)
       .WithModifiers(Modifiers.Public())
       .WithMembers(fields);

     return rowClassDeclaration;
   }

   private static field(header: ColumnHeader): FieldDeclarationSyntax {
     return FieldDeclaration(
         VariableDeclaration(Types.Syntax(header.Type))
           .WithVariables(SingletonSeparatedList(VariableDeclarator(Identifier(header.Name))
             .WithInitializer(EqualsValueClause(
               Types.TypeDefaultExpression(header.Type))))))
       .WithModifiers(Modifiers.Public());
   }

   private static generateFields(rowName: string): FieldDeclarationSyntax {
     let fieldDeclaration = FieldDeclaration(
         VariableDeclaration(
             GenericName(Identifier(`List`))
               .WithTypeArgumentList(
                 TypeArgumentList(SingletonSeparatedArray<TypeSyntax>(
                   IdentifierName(rowName)))))
           .WithVariables(
             SingletonSeparatedList(
               VariableDeclarator(Identifier(`_value`)))))
       .WithModifiers(Modifiers.PrivateStatic());

     return fieldDeclaration;
   }

   private static generateStaticConstructor(className: string, table: Table, rowName: string): ConstructorDeclarationSyntax {
     let rows = table.Rows.Select(row =>
       ObjectCreationExpression(
           IdentifierName(rowName))
         .WithInitializer(
           InitializerExpression(
             SyntaxKind.ObjectInitializerExpression,
             SeparatedArray<ExpressionSyntax>(
               RowValues(row, table.Header)))));

     let declaration = ConstructorDeclaration(Identifier(className))
       .WithModifiers(Modifiers.Static())
       .WithBody(
         Block(
           SingletonArray<StatementSyntax>(
             ExpressionStatement(
               AssignmentExpression(
                 SyntaxKind.SimpleAssignmentExpression,
                 IdentifierName(`_value`),
                 ObjectCreationExpression(
                     GenericName(Identifier(`List`))
                       .WithTypeArgumentList(
                         TypeArgumentList(
                           SingletonSeparatedArray<TypeSyntax>(
                             IdentifierName(rowName)))))
                   .WithInitializer(
                     InitializerExpression(
                       SyntaxKind.CollectionInitializerExpression,
                       SeparatedArray<ExpressionSyntax>(
                         rows
                       ))))))));

     return declaration;
   }

   private static SyntaxNodeOrToken[rowValues(tableRow: TableRow, header: TableHeader): ] {
     let result = new Array<SyntaxNodeOrToken>();
     for (let index = 0; index < header.Columns.Count; index++) {
       let columnHeader = header.Columns[index];
       let value = tableRow.Values[index];

       if (result.Count > 0) result.Add(Token(SyntaxKind.CommaToken));

       result.Add(
         AssignmentExpression(
           SyntaxKind.SimpleAssignmentExpression,
           IdentifierName(columnHeader.Name),
           ExpressionSyntaxFactory.ExpressionSyntax(value)));
     }

     return result.ToArray();
   }

   private static generateProperties(rowName: string): Array<PropertyDeclarationSyntax> {
     yield return PropertyDeclaration(
         PredefinedType(
           Token(SyntaxKind.IntKeyword)),
         Identifier(`Count`))
       .WithModifiers(Modifiers.PublicStatic())
       .WithExpressionBody(
         ArrowExpressionClause(
           MemberAccessExpression(
             SyntaxKind.SimpleMemberAccessExpression,
             IdentifierName(`_value`),
             IdentifierName(`Count`))))
       .WithSemicolonToken(
         Token(SyntaxKind.SemicolonToken));

     yield return
       PropertyDeclaration(
           GenericName(Identifier(`IReadOnlyList`))
             .WithTypeArgumentList(
               TypeArgumentList(
                 SingletonSeparatedArray<TypeSyntax>(
                   IdentifierName(rowName)))),
           Identifier(`Values`))
         .WithModifiers(Modifiers.PublicStatic())
         .WithExpressionBody(
           ArrowExpressionClause(
             IdentifierName(`_value`)))
         .WithSemicolonToken(
           Token(SyntaxKind.SemicolonToken));
   }
}
