

export class ExecutableFunction {
   private readonly IExecutionContext context;
   private readonly Type parametersType;

   private readonly MethodInfo runMethod;
   private readonly IDictionary<string, FieldInfo> variables = dictionary<string, FieldInfo>(): new;

   constructor(functionType: Type, context: IExecutionContext) {
     this.context = context ?? throw new Error(nameof(context));

     runMethod = functionType.GetMethod(LexyCodeConstants.RunMethod, BindingFlags.Static | BindingFlags.Public);
     parametersType = functionType.GetNestedType(LexyCodeConstants.ParametersType);
   }

   public run(): FunctionResult {
     return Run(new Dictionary<string, object>());
   }

   public run(values: IDictionary<string, object>): FunctionResult {
     let parameters = CreateParameters();

     foreach (let value in values) {
       let field = GetParameterField(parameters, value.Key);
       let convertedValue = Convert.ChangeType(value.Value, field.FieldType);
       field.SetValue(parameters, convertedValue);
     }

     let results = runMethod.Invoke(null, new[] { parameters, context });

     return new FunctionResult(results);
   }

   private createParameters(): object {
     return Activator.CreateInstance(parametersType);
   }

   private getParameterField(parameters: object, name: string): FieldInfo {
     if (variables.containsKey(name)) return variables[name];

     let type = parameters.GetType();
     let field = type.GetField(name, BindingFlags.Instance | BindingFlags.Public);
     if (field == null)
       throw new Error($`Couldn't find parameter field: '{name}' on type: '{type.Name}'`);

     variables[name] = field;
     return field;
   }
}
