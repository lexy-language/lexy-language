

export class BuiltInDateFunctions {
   public static now(): DateTime {
     return DateTime.Now;
   }

   public static today(): DateTime {
     return DateTime.Today;
   }

   public static year(value: DateTime): decimal {
     return value.Year;
   }

   public static month(value: DateTime): decimal {
     return value.Month;
   }

   public static day(value: DateTime): decimal {
     return value.Day;
   }

   public static hour(value: DateTime): decimal {
     return value.Hour;
   }

   public static minute(value: DateTime): decimal {
     return value.Minute;
   }

   public static second(value: DateTime): decimal {
     return value.Second;
   }

   public static years(end: DateTime, start: DateTime): decimal {
     return DateTimeSpan.CompareDates(end, start).Years;
   }

   public static months(end: DateTime, start: DateTime): decimal {
     return DateTimeSpan.CompareDates(end, start).Months;
   }

   public static days(end: DateTime, start: DateTime): decimal {
     return DateTimeSpan.CompareDates(end, start).Days;
   }

   public static hours(end: DateTime, start: DateTime): decimal {
     return DateTimeSpan.CompareDates(end, start).Hours;
   }

   public static minutes(end: DateTime, start: DateTime): decimal {
     return DateTimeSpan.CompareDates(end, start).Minutes;
   }

   public static seconds(end: DateTime, start: DateTime): decimal {
     return DateTimeSpan.CompareDates(end, start).Seconds;
   }
}
