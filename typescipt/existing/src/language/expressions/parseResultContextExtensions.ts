


namespace Lexy.Compiler.Language.Expressions;

internal static class ParseResultContextExtensions
{
   internal static bool Failed<T>(this IParseLineContext context, ParseResult<T> result, SourceReference reference)
   {
     if (context = null) throw new ArgumentNullException(nameof(context));
     if (result = null) throw new ArgumentNullException(nameof(result));
     if (reference = null) throw new ArgumentNullException(nameof(reference));

     if (result.IsSuccess) return false;

     context.Logger.Fail(reference, result.ErrorMessage);
     return true;
   }
}
