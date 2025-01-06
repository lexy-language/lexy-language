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

  class __Row {
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



  class __Row
  {
    Value = 0;
    Result = 0;
    constructor(Value, Result) {
      this.Value = Value;
      this.Result = Result;
    }
  }

  const _values = [
    new __Row(0, 0),
    new __Row(1, 1),
  ];

  function count() {
    return _values.length;
  }

  return {
    __Row: __Row,
    _values: _values,
    count: count
  }
}();
