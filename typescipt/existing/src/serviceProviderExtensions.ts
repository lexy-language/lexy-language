






namespace Lexy.Compiler;

public static class ServiceProviderExtensions
{
   public static IServiceCollection AddLexy(this IServiceCollection services)
   {
     services.TryAdd(ServiceDescriptor.Scoped<ILexyParser, LexyParser>());
     services.TryAdd(ServiceDescriptor.Scoped<IParserLogger, ParserLogger>());
     services.TryAdd(ServiceDescriptor.Scoped<IParserContext, ParserContext>());
     services.TryAdd(ServiceDescriptor.Scoped<ISourceCodeDocument, SourceCodeDocument>());
     services.TryAdd(ServiceDescriptor.Scoped<ITokenizer, Tokenizer>());

     services.TryAdd(ServiceDescriptor.Scoped<IExecutionEnvironment, ExecutionEnvironment>());
     services.TryAdd(ServiceDescriptor.Scoped<IExecutionContext, ExecutionContext>());

     services.TryAdd(ServiceDescriptor.Scoped<ILexyCompiler, LexyCompiler>());

     services.TryAdd(ServiceDescriptor.Scoped<ISpecificationRunnerContext, SpecificationRunnerContext>());
     services.TryAdd(ServiceDescriptor.Scoped<ISpecificationsRunner, SpecificationsRunner>());
     services.TryAdd(ServiceDescriptor.Scoped<ISpecificationFileRunner, SpecificationFileRunner>());
     services.TryAdd(ServiceDescriptor.Scoped<IScenarioRunner, ScenarioRunner>());
     services.TryAdd(ServiceDescriptor.Transient<ISpecificationsRunner, SpecificationsRunner>());

     return services;
   }
}
