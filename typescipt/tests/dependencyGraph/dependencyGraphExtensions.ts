

export class DependencyGraphExtensions {
   public static Dependencies BuildGraph(this IServiceProvider serviceProvider, string code,
     boolean throwException = true) {
     let parser = serviceProvider.GetRequiredService<ILexyParser>();
     let codeLines = code.Split(Environment.NewLine);
     let result = parser.parse(codeLines, `tests`, throwException);
     return DependencyGraphFactory.Create(result.rootNodes);
   }
}
