

export class BuiltInExpressionFunctions {
   private static readonly
     IDictionary<string, Func<string, SourceReference, IReadOnlyArray<Expression>, ParseExpressionFunctionsResult>>
     Values =
       new Dictionary<string,
         Func<string, SourceReference, IReadOnlyArray<Expression>, ParseExpressionFunctionsResult>> {
         { IntFunction.Name, Create(IntFunction.Create) },
         { AbsFunction.Name, Create(AbsFunction.Create) },
         { PowerFunction.Name, Create(PowerFunction.Create) },
         { RoundFunction.Name, Create(RoundFunction.Create) },

         { NowFunction.Name, Create(NowFunction.Create) },
         { TodayFunction.Name, Create(TodayFunction.Create) },

         { YearFunction.Name, Create(YearFunction.Create) },
         { MonthFunction.Name, Create(MonthFunction.Create) },
         { DayFunction.Name, Create(DayFunction.Create) },
         { HourFunction.Name, Create(HourFunction.Create) },
         { MinuteFunction.Name, Create(MinuteFunction.Create) },
         { SecondFunction.Name, Create(SecondFunction.Create) },

         { YearsFunction.Name, Create(YearsFunction.Create) },
         { MonthsFunction.Name, Create(MonthsFunction.Create) },
         { DaysFunction.Name, Create(DaysFunction.Create) },
         { HoursFunction.Name, Create(HoursFunction.Create) },
         { MinutesFunction.Name, Create(MinutesFunction.Create) },
         { SecondsFunction.Name, Create(SecondsFunction.Create) },

         { LookupFunction.Name, LookupFunction.Parse },
         { LookupRowFunction.Name, LookupRowFunction.Parse },

         { NewFunction.Name, Create(NewFunction.Create) },
         { FillParametersFunction.Name, Create(FillParametersFunction.Create) },
         { ExtractResultsFunction.Name, Create(ExtractResultsFunction.Create) }
       };

   public static ParseExpressionFunctionsResult Parse(string functionName, SourceReference reference,
     IReadOnlyArray<Expression> arguments) {
     return Values.TryGetValue(functionName, out let value)
       ? value(functionName, reference, arguments)
       : null;
   }

   private static Func<string, SourceReference, IReadOnlyArray<Expression>, ParseExpressionFunctionsResult> Create(
     Func<SourceReference, ExpressionFunction> factory) {
     return (name, reference, arguments) => {
       if (arguments.Count != 0)
         return ParseExpressionFunctionsResult.Failed(`Invalid number of arguments. No arguments expected.`);

       let function = factory(reference);
       return ParseExpressionFunctionsResult.Success(function);
     };
   }

   private static Func<string, SourceReference, IReadOnlyArray<Expression>, ParseExpressionFunctionsResult> Create(
     Func<SourceReference, Expression, ExpressionFunction> factory) {
     return (name, reference, arguments) => {
       if (arguments.Count != 1)
         return ParseExpressionFunctionsResult.Failed(`Invalid number of arguments. 1 argument expected.`);

       let function = factory(reference, arguments[0]);
       return ParseExpressionFunctionsResult.Success(function);
     };
   }

   private static Func<string, SourceReference, IReadOnlyArray<Expression>, ParseExpressionFunctionsResult> Create(
     Func<SourceReference, Expression, Expression, ExpressionFunction> factory) {
     return (name, reference, arguments) => {
       if (arguments.Count != 2)
         return ParseExpressionFunctionsResult.Failed(`Invalid number of arguments. 2 arguments expected.`);

       let function = factory(reference, arguments[0], arguments[1]);
       return ParseExpressionFunctionsResult.Success(function);
     };
   }
}
