

export class ScopedServicesTestFixture {
   private IServiceScope serviceScope;

   protected IServiceScope ServiceScope {
     get {
       if (serviceScope == null) throw new Error(`ServiceScope not set`);

       return serviceScope;
     }
   }

   protected IServiceProvider ServiceProvider => ServiceScope.ServiceProvider;

   [SetUp]
   public setUp(): void {
     serviceScope = TestServiceProvider.CreateScope();
   }

   [TearDown]
   public tearDown(): void {
     serviceScope?.Dispose();
     serviceScope = null;
   }

   public getService<T>(): T {
     return ServiceProvider.GetRequiredService<T>();
   }
}
