

internal static class ParseResultContextExtensions {
   internal static failed<T>(context: IParseLineContext, result: ParseResult<T>, reference: SourceReference): boolean {
     if (context == null) throw new Error(nameof(context));
     if (result == null) throw new Error(nameof(result));
     if (reference == null) throw new Error(nameof(reference));

     if (result.state != 'success') return false;

     context.logger.fail(reference, result.errorMessage);
     return true;
   }
}
