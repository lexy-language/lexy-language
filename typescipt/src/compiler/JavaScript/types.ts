
/*

internal static class Types {
   public static translateDate(dateTimeLiteral: DateTimeLiteral): ExpressionSyntax {
     return TranslateDate(dateTimeLiteral.DateTimeValue);
   }

   private static translateDate(dateTimeValue: Date): ExpressionSyntax {
     return ObjectCreationExpression(
         QualifiedName(
           IdentifierName(`System`),
           IdentifierName(`Date`)))
       .WithArgumentList(
         ArgumentList(
           SeparatedArray<ArgumentSyntax>(
             new SyntaxNodeOrToken[] {
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

   public static syntax(variableDefinition: VariableDefinition): TypeSyntax {
     return Syntax(variableDefinition.Type);
   }

   public static syntax(type: string): TypeSyntax {
     return type switch {
       TypeNames.String => PredefinedType(Token(SyntaxKind.StringKeyword)),
       TypeNames.Number => PredefinedType(Token(SyntaxKind.DecimalKeyword)),
       TypeNames.Date => ParseName(`System.Date`),
       TypeNames.Boolean => PredefinedType(Token(SyntaxKind.BoolKeyword)),
       _ => throw new Error(`Couldn't map type: ` + type)
     };
   }

   public static syntax(variableType: VariableType): TypeSyntax {
     return variableType switch {
       PrimitiveType primitive => Syntax(primitive.Type),
       EnumType enumType => IdentifierName(ClassNames.EnumClassName(enumType.Type)),
       TableType tableType => IdentifierName(tableType.Type),
       ComplexType complexType => ComplexTypeSyntax(complexType),
       ComplexTypeReference complexTypeReference => ComplexTypeReferenceSyntax(complexTypeReference),
       _ => throw new Error(`Couldn't map type: ` + variableType)
     };
   }

   private static complexTypeReferenceSyntax(complexTypeReference: ComplexTypeReference): TypeSyntax {
     return complexTypeReference switch {
       FunctionParametersType _ => QualifiedName(
         IdentifierName(ClassNames.FunctionClassName(complexTypeReference.Name)),
         IdentifierName(LexyCodeConstants.ParametersType)),
       FunctionResultsType _ => QualifiedName(
         IdentifierName(ClassNames.FunctionClassName(complexTypeReference.Name)),
         IdentifierName(LexyCodeConstants.resultsType)),
       TableRowType _ => QualifiedName(
         IdentifierName(ClassNames.TableClassName(complexTypeReference.Name)),
         IdentifierName(LexyCodeConstants.RowType)),
       _ => throw new Error($`Invalid type: {complexTypeReference?.getType()}`)
     };
   }

   private static complexTypeSyntax(complexType: ComplexType): TypeSyntax {
     switch (complexType.Source) {
       case ComplexTypeSource.FunctionParameters:
         return QualifiedName(
           IdentifierName(ClassNames.FunctionClassName(complexType.Name)),
           IdentifierName(LexyCodeConstants.ParametersType));
       case ComplexTypeSource.FunctionResults:
         return QualifiedName(
           IdentifierName(ClassNames.FunctionClassName(complexType.Name)),
           IdentifierName(LexyCodeConstants.resultsType));
       case ComplexTypeSource.TableRow:
         return QualifiedName(
           IdentifierName(ClassNames.TableClassName(complexType.Name)),
           IdentifierName(LexyCodeConstants.RowType));
       case ComplexTypeSource.Custom:
         return IdentifierName(ClassNames.TypeClassName(complexType.Name));
       default:
         throw new Error($`Invalid type: {complexType}`);
     }
   }

   public static syntax(type: VariableDeclarationType): TypeSyntax {
     return type switch {
       PrimitiveVariableDeclarationType primitive => Syntax(primitive.Type),
       CustomVariableDeclarationType customVariable => IdentifierNameSyntax(customVariable),
       ImplicitVariableDeclaration implicitVariable => Syntax(implicitVariable.VariableType),
       _ => throw new Error(`Couldn't map type: ` + type)
     };
   }

   private static identifierNameSyntax(customVariable: CustomVariableDeclarationType): IdentifierNameSyntax {
     return customVariable.VariableType switch {
       EnumType enumType => IdentifierName(ClassNames.EnumClassName(enumType.Type)),
       TableType tableType => IdentifierName(ClassNames.TableClassName(tableType.Type)),
       CustomType customType => IdentifierName(ClassNames.TypeClassName(customType.Type)),
       _ => throw new Error(`Couldn't map type: ` + customVariable.VariableType)
     };
   }
}
*/