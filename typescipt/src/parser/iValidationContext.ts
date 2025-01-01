

export interface IValidationContext {
   IParserLogger Logger
   RootNodeList RootNodes

   IVariableContext VariableContext

   IDisposable CreateVariableScope();
}
