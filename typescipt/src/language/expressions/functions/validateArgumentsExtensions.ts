

export class ValidateArgumentsExtensions {
   public static IValidationContext ValidateType(this IValidationContext context, Expression expression,
     number argumentIndex, string name, VariableType type, SourceReference reference, string functionHelp) {
     let valueTypeEnd = expression.DeriveType(context);
     if (valueTypeEnd == null || !valueTypeEnd.Equals(type))
       context.Logger.Fail(reference,
         $`Invalid argument {argumentIndex}. '{name}' should be of type '{type}' but is '{valueTypeEnd}'. {functionHelp}`);

     return context;
   }
}
