import {FunctionCallExpression} from "../../../language/expressions/functionCallExpression";
import {NodeType} from "../../../language/nodeType";
import {LookupFunction} from "../../../language/expressions/functions/lookupFunction";
import {LookUpFunctionCall} from "./lookUpFunctionCall";
import {LookupRowFunction} from "../../../language/expressions/functions/lookupRowFunction";
import {LookUpRowFunctionCall} from "./lookUpRowFunctionCall";
import {IntFunction} from "../../../language/expressions/functions/intFunction";
import {IntFunctionCall} from "./intFunctionCall";
import {AbsFunction} from "../../../language/expressions/functions/absFunction";
import {AbsFunctionCall} from "./absFunctionCall";
import {PowerFunction} from "../../../language/expressions/functions/powerFunction";
import {PowerFunctionCall} from "./powerFunctionCall";
import {RoundFunction} from "../../../language/expressions/functions/roundFunction";
import {RoundFunctionCall} from "./roundFunctionCall";
import {NowFunction} from "../../../language/expressions/functions/nowFunction";
import {NowFunctionCall} from "./nowFunctionCall";
import {TodayFunction} from "../../../language/expressions/functions/todayFunction";
import {TodayFunctionCall} from "./todayFunctionCall";
import {YearFunction} from "../../../language/expressions/functions/yearFunction";
import {YearFunctionCall} from "./yearFunctionCall";
import {MonthFunction} from "../../../language/expressions/functions/monthFunction";
import {MonthFunctionCall} from "./monthFunctionCall";
import {DayFunction} from "../../../language/expressions/functions/dayFunction";
import {DayFunctionCall} from "./dayFunctionCall";
import {HourFunction} from "../../../language/expressions/functions/hourFunction";
import {HourFunctionCall} from "./hourFunctionCall";
import {MinuteFunction} from "../../../language/expressions/functions/minuteFunction";
import {MinuteFunctionCall} from "./minuteFunctionCall";
import {SecondFunction} from "../../../language/expressions/functions/secondFunction";
import {SecondFunctionCall} from "./secondFunctionCall";
import {YearsFunction} from "../../../language/expressions/functions/yearsFunction";
import {YearsFunctionCall} from "./yearsFunctionCall";
import {MonthsFunction} from "../../../language/expressions/functions/monthsFunction";
import {MonthsFunctionCall} from "./monthsFunctionCall";
import {DaysFunction} from "../../../language/expressions/functions/daysFunction";
import {DaysFunctionCall} from "./daysFunctionCall";
import {HoursFunction} from "../../../language/expressions/functions/hoursFunction";
import {HoursFunctionCall} from "./hoursFunctionCall";
import {MinutesFunction} from "../../../language/expressions/functions/minutesFunction";
import {MinutesFunctionCall} from "./minutesFunctionCall";
import {SecondsFunction} from "../../../language/expressions/functions/secondsFunction";
import {SecondsFunctionCall} from "./secondsFunctionCall";
import {LexyFunction} from "../../../language/expressions/functions/lexyFunction";
import {LexyFunctionCall} from "./lexyFunctionCall";
import {FunctionCall} from "./functionCall";

export function createFunctionCall(expression: FunctionCallExpression): FunctionCall | null {

  function factory<T>(factory: (expression: T) => FunctionCall): FunctionCall {
    const specific = expression as T;
    return factory(specific);
  }

  switch (expression.expressionFunction.nodeType) {
    case NodeType.LookupFunction:
      return factory<LookupFunction>(node => new LookUpFunctionCall(node));
    case NodeType.LookupRowFunction:
      return factory<LookupRowFunction>(node => new LookUpRowFunctionCall(node));
    case NodeType.IntFunction:
      return factory<IntFunction>(node => new IntFunctionCall(node));
    case NodeType.AbsFunction:
      return factory<AbsFunction>(node => new AbsFunctionCall(node));
    case NodeType.PowerFunction:
      return factory<PowerFunction>(node => new PowerFunctionCall(node));
    case NodeType.RoundFunction:
      return factory<RoundFunction>(node => new RoundFunctionCall(node));

    case NodeType.NowFunction:
      return factory<NowFunction>(node => new NowFunctionCall(node));
    case NodeType.TodayFunction:
      return factory<TodayFunction>(node => new TodayFunctionCall(node));

    case NodeType.YearFunction:
      return factory<YearFunction>(node => new YearFunctionCall(node),);
    case NodeType.MonthFunction:
      return factory<MonthFunction>(node => new MonthFunctionCall(node));
    case NodeType.DayFunction:
      return factory<DayFunction>(node => new DayFunctionCall(node));
    case NodeType.HourFunction:
      return factory<HourFunction>(node => new HourFunctionCall(node));
    case NodeType.MinuteFunction:
      return factory<MinuteFunction>(node => new MinuteFunctionCall(node));
    case NodeType.SecondFunction:
      return factory<SecondFunction>(node => new SecondFunctionCall(node));

    case NodeType.YearsFunction:
      return factory<YearsFunction>(node => new YearsFunctionCall(node));
    case NodeType.MonthsFunction:
      return factory<MonthsFunction>(node => new MonthsFunctionCall(node));
    case NodeType.DaysFunction:
      return factory<DaysFunction>(node => new DaysFunctionCall(node));
    case NodeType.HoursFunction:
      return factory<HoursFunction>(node => new HoursFunctionCall(node));
    case NodeType.MinutesFunction:
      return factory<MinutesFunction>(node => new MinutesFunctionCall(node));
    case NodeType.SecondsFunction:
      return factory<SecondsFunction>(node => new SecondsFunctionCall(node));

    case NodeType.LexyFunction:
      return factory<LexyFunction>(node => new LexyFunctionCall(node));

    default:
      return null;
  }
}