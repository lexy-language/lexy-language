

export class ExecutionException extends Exception {
   constructor() {
   }

   protected ExecutionException(SerializationInfo info, StreamingContext context) : base(info, context) {
   }

   public ExecutionException(string message) : base(message) {
   }

   public ExecutionException(string message, Exception innerException) : base(message, innerException) {
   }
}
