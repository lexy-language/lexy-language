export class RunLexySpecifications extends ScopedServicesTestFixture {
  it(

  'XXXX'
,

  async()

=> {
  public allSpecifications(): void {
    LoggingConfiguration.LogFileNames();

    let runner = GetService<ISpecificationsRunner>();
    runner.runAll(`../../../../../../laws/Specifications`);
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
// runner.run(`../../../../../../laws/Specifications/Isolate.lexy`);

  runner
.

  Run(

`../../../../../../laws/Specifications/Function/If.lexy`);
  //runner.run(`../../../../../../laws/Specifications/Function/Variables.lexy`);
  //runner.run(`../../../../../../laws/Specifications/BuiltInFunctions/Extract.lexy`);
}
}
