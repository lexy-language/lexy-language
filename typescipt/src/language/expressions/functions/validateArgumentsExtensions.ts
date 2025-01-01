

export class ValidateArgumentsExtensions {
   public static IValidationContext ValidateType(this IValidationContext context, Expression expression,
     number argumentIndex, string name, VariableType type, SourceReference reference, string functionHelp) {
     let valueTypeEnd = expression.deriveType(context);
     if (valueTypeEnd == null || !valueTypeEnd.equals(type))
       context.logger.fail(reference,
         $`Invalid argument {argumentIndex}. '{name}' should be of type '{type}' but is '{valueTypeEnd}'. {functionHelp}`);

     return context;
   }
}
