export class ServiceProviderConfiguration {
  public static createServices(): ServiceProvider {
    let serviceProvider = new ServiceCollection()
      .AddLogging()
      .AddSingleton(LoggingConfiguration.CreateLoggerFactory())
      .AddLexy()
      .BuildServiceProvider();

    return serviceProvider;
  }
}
