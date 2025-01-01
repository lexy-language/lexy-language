

[SetUpFixture]
export class TestServiceProvider {
   private static ServiceProvider instance;

   [OneTimeSetUp]
   public runBeforeAnyTests(): void {
     LoggingConfiguration.RemoveOldFiles();
     LoggingConfiguration.ConfigureSerilog();

     instance = ServiceProviderConfiguration.CreateServices();
   }

   public static createScope(): IServiceScope {
     return instance.CreateScope();
   }
}
