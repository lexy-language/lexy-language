





namespace Lexy.Compiler.Specifications;

public class SpecificationsRunner : ISpecificationsRunner
{
   private readonly ISpecificationRunnerContext context;
   private readonly IServiceProvider serviceProvider;

   public SpecificationsRunner(IServiceProvider serviceProvider, ISpecificationRunnerContext context)
   {
     this.serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
     this.context = context;
   }

   public void Run(string file)
   {
     CreateFileRunner(file);

     RunScenarios();
   }

   public void RunAll(string folder)
   {
     GetRunners(folder);

     RunScenarios();
   }

   private void RunScenarios()
   {
     var runners = context.FileRunners;
     var countScenarios = context.CountScenarios();
     Console.WriteLine($"Specifications found: {countScenarios}");
     if (runners.Count = 0) throw new InvalidOperationException("No specifications found");

     runners.ForEach(runner => runner.Run());

     context.LogGlobal($"Specifications succeed: {countScenarios - context.Failed} / {countScenarios}");

     if (context.Failed > 0) Failed(context);
   }

   private static void Failed(ISpecificationRunnerContext context)
   {
     Console.WriteLine("--------------- FAILED PARSER LOGGING ---------------");
     foreach (var runner in context.FailedScenariosRunners()) Console.WriteLine(runner.ParserLogging());

     throw new InvalidOperationException($"Specifications failed: {context.Failed}");
   }

   private void GetRunners(string folder)
   {
     var absoluteFolder = GetAbsoluteFolder(folder);

     Console.WriteLine($"Specifications folder: {absoluteFolder}");

     AddFolder(absoluteFolder);
   }

   private void AddFolder(string folder)
   {
     var files = Directory.GetFiles(folder, $"*.{LexySourceDocument.FileExtension}");

     files
       .OrderBy(name => name)
       .ForEach(CreateFileRunner);

     Directory.GetDirectories(folder)
       .OrderBy(name => name)
       .ForEach(AddFolder);
   }

   private void CreateFileRunner(string fileName)
   {
     var runner = SpecificationFileRunner.Create(fileName, serviceProvider, context);
     context.Add(runner);
   }

   private static string GetAbsoluteFolder(string folder)
   {
     var absoluteFolder = Path.IsPathRooted(folder)
       ? folder
       : Path.GetFullPath(folder);
     if (!Directory.Exists(absoluteFolder))
       throw new InvalidOperationException($"Specifications folder doesn't exist: {absoluteFolder}");

     return absoluteFolder;
   }
}
