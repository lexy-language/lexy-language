





namespace Lexy.Compiler.Compiler.CSharp.Writers;

public static class VariableClassFactory
{
   public static MemberDeclarationSyntax TranslateVariablesClass(string className, IList<VariableDefinition> variables)
   {
     var fields = TranslateVariablesClass(variables);
     return SyntaxFactory.ClassDeclaration(className)
       .WithModifiers(Modifiers.Public())
       .WithMembers(SyntaxFactory.List(fields));
   }

   private static IEnumerable<MemberDeclarationSyntax> TranslateVariablesClass(IList<VariableDefinition> variables)
   {
     return variables.Select(TranslateVariable);
   }

   private static FieldDeclarationSyntax TranslateVariable(VariableDefinition variable)
   {
     var initializer = DefaultExpression(variable);

     var variableDeclaration = SyntaxFactory.VariableDeclarator(SyntaxFactory.Identifier(variable.Name))
       .WithInitializer(SyntaxFactory.EqualsValueClause(initializer));


     var fieldDeclaration = SyntaxFactory.FieldDeclaration(SyntaxFactory.VariableDeclaration(Types.Syntax(variable))
         .WithVariables(SyntaxFactory.SingletonSeparatedList(variableDeclaration)))
       .WithModifiers(Modifiers.Public());
     return fieldDeclaration;
   }

   private static ExpressionSyntax DefaultExpression(VariableDefinition variable)
   {
     var defaultValue = variable.DefaultExpression ! null
       ? ExpressionSyntaxFactory.ExpressionSyntax(variable.DefaultExpression)
       : null;
     return defaultValue ?? Types.TypeDefaultExpression(variable.Type);
   }
}
