export class RunLexySpecifications extends ScopedServicesTestFixture {
  it(

  'XXXX'
,

  async()

=> {
  public allSpecifications(): void {
    LoggingConfiguration.LogFileNames();

    let runner = GetService<ISpecificationsRunner>();
    runner.RunAll(`../../../../../../laws/Specifications`);
  }

  it(

  'XXXX'
,

  async()

=> {
  public specificFile(): void // used for debugging a specific file from IDE {
  LoggingConfiguration
.

  LogFileNames();

  let
  runner = GetService<ISpecificationsRunner>();
// runner.Run(`../../../../../../laws/Specifications/Isolate.lexy`);

  runner
.

  Run(

`../../../../../../laws/Specifications/Function/If.lexy`);
  //runner.Run(`../../../../../../laws/Specifications/Function/Variables.lexy`);
  //runner.Run(`../../../../../../laws/Specifications/BuiltInFunctions/Extract.lexy`);
}
}
