

export class ValidationContextExtensions {
   public static void ValidateTypeAndDefault(this IValidationContext context, SourceReference reference,
     VariableDeclarationType type, Expression defaultValueExpression) {
     if (context == null) throw new Error(nameof(context));
     if (reference == null) throw new Error(nameof(reference));
     if (type == null) throw new Error(nameof(type));

     switch (type) {
       case CustomVariableDeclarationType customVariableType:
         ValidateCustomVariableType(context, reference, customVariableType, defaultValueExpression);
         break;

       case PrimitiveVariableDeclarationType primitiveVariableType:
         ValidatePrimitiveVariableType(context, reference, primitiveVariableType, defaultValueExpression);
         break;

       default:
         throw new Error($`Invalid Type: {type.GetType()}`);
     }
   }

   private static void ValidateCustomVariableType(IValidationContext context, SourceReference reference,
     CustomVariableDeclarationType customVariableDeclarationType, Expression defaultValueExpression) {
     let type = context.RootNodes.GetType(customVariableDeclarationType.Type);
     if (type == null || type is not EnumType && type is not CustomType) {
       context.logger.fail(reference, $`Unknown type: '{customVariableDeclarationType.Type}'`);
       return;
     }

     if (defaultValueExpression == null) return;

     if (!(type is EnumType)) {
       context.logger.fail(reference,
         $`Invalid default value '{defaultValueExpression}'. Type: '{customVariableDeclarationType.Type}' does not support a default value.`);
       return;
     }

     if (defaultValueExpression is not MemberAccessExpression memberAccessLiteralExpression) {
       context.logger.fail(reference,
         $`Invalid default value '{defaultValueExpression}'. (type: '{customVariableDeclarationType.Type}')`);
       return;
     }

     let variableReference = memberAccessLiteralExpression.Variable;
     if (variableReference.Parts != 2)
       context.logger.fail(reference,
         $`Invalid default value '{defaultValueExpression}'. (type: '{customVariableDeclarationType.Type}')`);
     if (variableReference.ParentIdentifier != customVariableDeclarationType.Type)
       context.logger.fail(reference,
         $`Invalid default value '{defaultValueExpression}'. Invalid enum type. (type: '{customVariableDeclarationType.Type}')`);

     let enumDeclaration = context.RootNodes.GetEnum(variableReference.ParentIdentifier);
     if (enumDeclaration == null || !enumDeclaration.containsMember(variableReference.Path[1]))
       context.logger.fail(reference,
         $`Invalid default value '{defaultValueExpression}'. Invalid member. (type: '{customVariableDeclarationType.Type}')`);
   }

   private static void ValidatePrimitiveVariableType(IValidationContext context, SourceReference reference,
     PrimitiveVariableDeclarationType primitiveVariableDeclarationType, Expression defaultValueExpression) {
     if (defaultValueExpression == null) return;

     switch (primitiveVariableDeclarationType.Type) {
       case TypeNames.Number:
         ValidateDefaultLiteral<NumberLiteralToken>(context, reference, primitiveVariableDeclarationType,
           defaultValueExpression);
         break;

       case TypeNames.String:
         ValidateDefaultLiteral<QuotedLiteralToken>(context, reference, primitiveVariableDeclarationType,
           defaultValueExpression);
         break;

       case TypeNames.Boolean:
         ValidateDefaultLiteral<BooleanLiteral>(context, reference, primitiveVariableDeclarationType,
           defaultValueExpression);
         break;

       case TypeNames.Date:
         ValidateDefaultLiteral<DateTimeLiteral>(context, reference, primitiveVariableDeclarationType,
           defaultValueExpression);
         break;

       default:
         throw new Error($`Unexpected type: {primitiveVariableDeclarationType.Type}`);
     }
   }

   private static void ValidateDefaultLiteral<T>(IValidationContext context, SourceReference reference,
     PrimitiveVariableDeclarationType primitiveVariableDeclarationType,
     Expression defaultValueExpression)
     where T : ILiteralToken {
     if (defaultValueExpression is not LiteralExpression literalExpression) {
       context.logger.fail(reference,
         $`Invalid default value '{defaultValueExpression}'. (type: '{primitiveVariableDeclarationType.Type}')`);
       return;
     }

     if (literalExpression.Literal is not T)
       context.logger.fail(reference,
         $`Invalid default value '{defaultValueExpression}'. (type: '{primitiveVariableDeclarationType.Type}')`);
   }
}
