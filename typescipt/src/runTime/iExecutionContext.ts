
export interface IExecutionContext {
   void LogDebug(string message);

   void LogVariable<T>(string name, T value);
}
