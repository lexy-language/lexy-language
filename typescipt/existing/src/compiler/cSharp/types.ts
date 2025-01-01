









namespace Lexy.Compiler.Compiler.CSharp;

internal static class Types
{
   public static ExpressionSyntax TranslateDate(DateTimeLiteral dateTimeLiteral)
   {
     return TranslateDate(dateTimeLiteral.DateTimeValue);
   }

   private static ExpressionSyntax TranslateDate(DateTime dateTimeValue)
   {
     return ObjectCreationExpression(
         QualifiedName(
           IdentifierName("System"),
           IdentifierName("DateTime")))
       .WithArgumentList(
         ArgumentList(
           SeparatedList<ArgumentSyntax>(
             new SyntaxNodeOrToken[]
             {
               Arguments.Numeric(dateTimeValue.Year),
               Token(SyntaxKind.CommaToken),
               Arguments.Numeric(dateTimeValue.Month),
               Token(SyntaxKind.CommaToken),
               Arguments.Numeric(dateTimeValue.Day),
               Token(SyntaxKind.CommaToken),
               Arguments.Numeric(dateTimeValue.Hour),
               Token(SyntaxKind.CommaToken),
               Arguments.Numeric(dateTimeValue.Minute),
               Token(SyntaxKind.CommaToken),
               Arguments.Numeric(dateTimeValue.Second)
             })));
   }

   public static TypeSyntax Syntax(VariableDefinition variableDefinition)
   {
     return Syntax(variableDefinition.Type);
   }

   public static TypeSyntax Syntax(string type)
   {
     return type switch
     {
       TypeNames.String => PredefinedType(Token(SyntaxKind.StringKeyword)),
       TypeNames.Number => PredefinedType(Token(SyntaxKind.DecimalKeyword)),
       TypeNames.Date => ParseName("System.DateTime"),
       TypeNames.Boolean => PredefinedType(Token(SyntaxKind.BoolKeyword)),
       _ => throw new InvalidOperationException("Couldn't map type: " + type)
     };
   }

   public static TypeSyntax Syntax(VariableType variableType)
   {
     return variableType switch
     {
       PrimitiveType primitive => Syntax(primitive.Type),
       EnumType enumType => IdentifierName(ClassNames.EnumClassName(enumType.Type)),
       TableType tableType => IdentifierName(tableType.Type),
       ComplexType complexType => ComplexTypeSyntax(complexType),
       ComplexTypeReference complexTypeReference => ComplexTypeReferenceSyntax(complexTypeReference),
       _ => throw new InvalidOperationException("Couldn't map type: " + variableType)
     };
   }

   private static TypeSyntax ComplexTypeReferenceSyntax(ComplexTypeReference complexTypeReference)
   {
     return complexTypeReference switch
     {
       FunctionParametersType _ => QualifiedName(
         IdentifierName(ClassNames.FunctionClassName(complexTypeReference.Name)),
         IdentifierName(LexyCodeConstants.ParametersType)),
       FunctionResultsType _ => QualifiedName(
         IdentifierName(ClassNames.FunctionClassName(complexTypeReference.Name)),
         IdentifierName(LexyCodeConstants.ResultsType)),
       TableRowType _ => QualifiedName(
         IdentifierName(ClassNames.TableClassName(complexTypeReference.Name)),
         IdentifierName(LexyCodeConstants.RowType)),
       _ => throw new InvalidOperationException($"Invalid type: {complexTypeReference?.GetType()}")
     };
   }

   private static TypeSyntax ComplexTypeSyntax(ComplexType complexType)
   {
     switch (complexType.Source)
     {
       case ComplexTypeSource.FunctionParameters:
         return QualifiedName(
           IdentifierName(ClassNames.FunctionClassName(complexType.Name)),
           IdentifierName(LexyCodeConstants.ParametersType));
       case ComplexTypeSource.FunctionResults:
         return QualifiedName(
           IdentifierName(ClassNames.FunctionClassName(complexType.Name)),
           IdentifierName(LexyCodeConstants.ResultsType));
       case ComplexTypeSource.TableRow:
         return QualifiedName(
           IdentifierName(ClassNames.TableClassName(complexType.Name)),
           IdentifierName(LexyCodeConstants.RowType));
       case ComplexTypeSource.Custom:
         return IdentifierName(ClassNames.CustomClassName(complexType.Name));
       default:
         throw new InvalidOperationException($"Invalid type: {complexType}");
     }
   }

   public static TypeSyntax Syntax(VariableDeclarationType type)
   {
     return type switch
     {
       PrimitiveVariableDeclarationType primitive => Syntax(primitive.Type),
       CustomVariableDeclarationType customVariable => IdentifierNameSyntax(customVariable),
       ImplicitVariableDeclaration implicitVariable => Syntax(implicitVariable.VariableType),
       _ => throw new InvalidOperationException("Couldn't map type: " + type)
     };
   }

   private static IdentifierNameSyntax IdentifierNameSyntax(CustomVariableDeclarationType customVariable)
   {
     return customVariable.VariableType switch
     {
       EnumType enumType => IdentifierName(ClassNames.EnumClassName(enumType.Type)),
       TableType tableType => IdentifierName(ClassNames.TableClassName(tableType.Type)),
       CustomType customType => IdentifierName(ClassNames.TypeClassName(customType.Type)),
       _ => throw new InvalidOperationException("Couldn't map type: " + customVariable.VariableType)
     };
   }

   public static ExpressionSyntax TypeDefaultExpression(VariableDeclarationType variableDeclarationType)
   {
     return variableDeclarationType switch
     {
       PrimitiveVariableDeclarationType expression => PrimitiveTypeDefaultExpression(expression),
       CustomVariableDeclarationType customType => DefaultExpressionSyntax(customType),
       _ => throw new InvalidOperationException(
         $"Wrong VariableDeclarationType {variableDeclarationType.GetType()}")
     };
   }

   private static ExpressionSyntax DefaultExpressionSyntax(CustomVariableDeclarationType customType)
   {
     if (customType.VariableType is CustomType) return ObjectCreationExpression(IdentifierNameSyntax(customType));
     return DefaultExpression(IdentifierNameSyntax(customType));
   }

   public static ExpressionSyntax PrimitiveTypeDefaultExpression(PrimitiveVariableDeclarationType type)
   {
     switch (type.Type)
     {
       case TypeNames.Number:
       case TypeNames.Boolean:
         var typeSyntax = Syntax(type);
         return DefaultExpression(typeSyntax);

       case TypeNames.String:
         return LiteralExpression(
           SyntaxKind.StringLiteralExpression,
           Literal(""));

       case TypeNames.Date:
         return TranslateDate(DateTypeDefault.Value);

       default:
         throw new InvalidOperationException("Invalid type: " + type.Type);
     }
   }
}
