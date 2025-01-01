

internal static class ParseResultContextExtensions {
   internal static failed<T>(context: IParseLineContext, result: ParseResult<T>, reference: SourceReference): boolean {
     if (context == null) throw new Error(nameof(context));
     if (result == null) throw new Error(nameof(result));
     if (reference == null) throw new Error(nameof(reference));

     if (result.IsSuccess) return false;

     context.Logger.Fail(reference, result.ErrorMessage);
     return true;
   }
}
