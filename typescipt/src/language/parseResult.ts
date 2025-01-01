
export class ParseResult<T> {
   public string ErrorMessage
   public boolean IsSuccess
   public T Result

   parseResult(result: T): protected {
     Result = result;
     IsSuccess = true;
   }

   parseResult(success: boolean, errorMessage: string): protected {
     ErrorMessage = errorMessage;
     IsSuccess = success;
   }
}
