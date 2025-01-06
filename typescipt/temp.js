"use strict";

const type = function scope() {

  function TestSimpleReturn(__parameters, __context) {
    const __result = {
      Result,
    }
    __result.Result = 777;
    return __result;
  }

  class __Results {

  }

  class __Parameters {
    aaa = 141;
    bbb = 777
    ccc = 666;
  }

  let values = {
    aaa: 123,
    bbb: 457
  }

  let __parameters = new __Parameters();
  for (let key in values) {
    __parameters[key] = values[key];
  }

  TestSimpleReturn.__Results = __Results;
  TestSimpleReturn.__parameters = __parameters;

  return TestSimpleReturn
}();
