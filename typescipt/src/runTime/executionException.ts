

export class ExecutionException extends Exception {
   constructor() {
   }

   protected ExecutionException(SerializationInfo info, StreamingContext context) super(info, context) {
   }

   public ExecutionException(string message) super(message) {
   }

   public ExecutionException(string message, Exception innerException) super(message, innerException) {
   }
}
