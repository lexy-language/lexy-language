namespace Lexy.Compiler.Language;

public abstract class ParseResult<T>
{
   public string ErrorMessage { get; }
   public bool IsSuccess { get; }
   public T Result { get; }

   protected ParseResult(T result)
   {
     Result = result;
     IsSuccess = true;
   }

   protected ParseResult(bool success, string errorMessage)
   {
     ErrorMessage = errorMessage;
     IsSuccess = success;
   }
}
