

export class VariableClassFactory {
   public static translateVariablesClass(className: string, variables: Array<VariableDefinition>): MemberDeclarationSyntax {
     let fields = TranslateVariablesClass(variables);
     return SyntaxFactory.ClassDeclaration(className)
       .WithModifiers(Modifiers.Public())
       .WithMembers(SyntaxFactory.List(fields));
   }

   private static translateVariablesClass(variables: Array<VariableDefinition>): Array<MemberDeclarationSyntax> {
     return variables.Select(TranslateVariable);
   }

   private static translateVariable(variable: VariableDefinition): FieldDeclarationSyntax {
     let initializer = DefaultExpression(variable);

     let variableDeclaration = SyntaxFactory.VariableDeclarator(SyntaxFactory.Identifier(variable.Name))
       .WithInitializer(SyntaxFactory.equalsValueClause(initializer));


     let fieldDeclaration = SyntaxFactory.FieldDeclaration(SyntaxFactory.VariableDeclaration(Types.Syntax(variable))
         .WithVariables(SyntaxFactory.SingletonSeparatedList(variableDeclaration)))
       .WithModifiers(Modifiers.Public());
     return fieldDeclaration;
   }

   private static defaultExpression(variable: VariableDefinition): ExpressionSyntax {
     let defaultValue = variable.DefaultExpression != null
       ? ExpressionSyntaxFactory.ExpressionSyntax(variable.DefaultExpression)
       : null;
     return defaultValue ?? Types.TypeDefaultExpression(variable.Type);
   }
}
