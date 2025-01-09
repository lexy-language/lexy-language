import {createRunner} from "./createRunner";

describe('RunLexySpecifications', () => {
  it('allSpecifications', async() => {
    const runner = createRunner();
    runner.runAll(`../laws/specifications`);
  });

  it('specificFile',  async()=> {
    const runner = createRunner();
    runner.run(`../laws/Specifications/Type/Syntax.lexy`);
    runner.run(`../laws/Specifications/Scenario/UnknownParameterType.lexy`);
  });
});
