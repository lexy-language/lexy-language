

export class SpecificationsRunner extends ISpecificationsRunner {
   private readonly ISpecificationRunnerContext context;
   private readonly IServiceProvider serviceProvider;

   constructor(serviceProvider: IServiceProvider, context: ISpecificationRunnerContext) {
     this.serviceProvider = serviceProvider ?? throw new Error(nameof(serviceProvider));
     this.context = context;
   }

   public run(file: string): void {
     CreateFileRunner(file);

     RunScenarios();
   }

   public runAll(folder: string): void {
     GetRunners(folder);

     RunScenarios();
   }

   private runScenarios(): void {
     let runners = context.FileRunners;
     let countScenarios = context.CountScenarios();
     Console.WriteLine($`Specifications found: {countScenarios}`);
     if (runners.Count == 0) throw new Error(`No specifications found`);

     runners.ForEach(runner => runner.Run());

     context.LogGlobal($`Specifications succeed: {countScenarios - context.Failed} / {countScenarios}`);

     if (context.Failed > 0) Failed(context);
   }

   private static failed(context: ISpecificationRunnerContext): void {
     Console.WriteLine(`--------------- FAILED PARSER LOGGING ---------------`);
     foreach (let runner in context.FailedScenariosRunners()) Console.WriteLine(runner.ParserLogging());

     throw new Error($`Specifications failed: {context.Failed}`);
   }

   private getRunners(folder: string): void {
     let absoluteFolder = GetAbsoluteFolder(folder);

     Console.WriteLine($`Specifications folder: {absoluteFolder}`);

     AddFolder(absoluteFolder);
   }

   private addFolder(folder: string): void {
     let files = Directory.GetFiles(folder, $`*.{LexySourceDocument.FileExtension}`);

     files
       .OrderBy(name => name)
       .ForEach(CreateFileRunner);

     Directory.GetDirectories(folder)
       .OrderBy(name => name)
       .ForEach(AddFolder);
   }

   private createFileRunner(fileName: string): void {
     let runner = SpecificationFileRunner.Create(fileName, serviceProvider, context);
     context.Add(runner);
   }

   private static getAbsoluteFolder(folder: string): string {
     let absoluteFolder = Path.IsPathRooted(folder)
       ? folder
       : Path.GetFullPath(folder);
     if (!Directory.Exists(absoluteFolder))
       throw new Error($`Specifications folder doesn't exist: {absoluteFolder}`);

     return absoluteFolder;
   }
}
