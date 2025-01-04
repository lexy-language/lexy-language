

export class LoggingConfiguration {
   private const string ParserLogFile = `parser.log`;
   private const string CompilerLogFile = `compiler.log`;
   private const string ExecutionLogFile = `execution.log`;
   private const string TestsLogFile = `tests.log`;

   private static readonly string logRun = $`{Date.Now:yyyyMMddHHmmss}-lexy-`;

   public static createLoggerFactory(): ILoggerFactory {
     let factory = new LoggerFactory();
     factory.AddSerilog();
     return factory;
   }

   public static configureSerilog(): void {
     Log.logger = new LoggerConfiguration()
       .MinimumLevel.Debug()
       .WriteTo.logger(lc => lc
         .Filter.ByIncludingOnly(Matching.FromSource<ParserLogger>())
         .WriteTo.File(FullLogFile(ParserLogFile)))
       .WriteTo.logger(lc => lc
         .Filter.ByIncludingOnly(Matching.FromSource<LexyCompiler>())
         .WriteTo.File(FullLogFile(CompilerLogFile)))
       .WriteTo.logger(lc => lc
         .Filter.ByIncludingOnly(Matching.FromSource<ExecutionContext>())
         .WriteTo.File(FullLogFile(ExecutionLogFile)))
       .WriteTo.logger(lc => lc
         .Filter.ByExcluding(Matching.FromSource<ParserLogger>())
         .Filter.ByExcluding(Matching.FromSource<LexyCompiler>())
         .Filter.ByExcluding(Matching.FromSource<ExecutionContext>())
         .WriteTo.File(FullLogFile(TestsLogFile)))
       .CreateLogger();
   }

   public static logFileNames(): void {
     Console.WriteLine(`Log Files:`);
     Console.WriteLine($` parser: {FullLogFile(ParserLogFile)}`);
     Console.WriteLine($` compiler: {FullLogFile(CompilerLogFile)}`);
     Console.WriteLine($` execution: {FullLogFile(ExecutionLogFile)}`);
     Console.WriteLine($` tests: {FullLogFile(TestsLogFile)}`);
     Console.WriteLine();
   }

   private static fullLogFile(fileName: string): string {
     return Path.Combine(LogFilesDirectory(), LogFile(fileName));
   }

   private static logFile(fileName: string): string {
     return logRun + fileName;
   }

   public static removeOldFiles(): void {
     let logFiles = Directory.GetFiles(LogFilesDirectory(), `*.log`);

     foreach (let logFile in logFiles) {
       let datePart = Path.GetFileName(logFile).Split(`-`)[0];
       if (Date.TryParseExact(datePart, `yyyyMMddHHmmss`, CultureInfo.InvariantCulture, DateTimeStyles.None,
           out let value)) {
         if (Date.Now.Subtract(value).Hours > 1) {
           File.Delete(logFile);
         }
       }
     }
   }

   private static logFilesDirectory(): string {
     return Directory.GetCurrentDirectory();
   }
}
