

export class BuiltInDateFunctions {
   public static now(): Date {
     return Date.Now;
   }

   public static today(): Date {
     return Date.Today;
   }

   public static year(value: Date): decimal {
     return value.Year;
   }

   public static month(value: Date): decimal {
     return value.Month;
   }

   public static day(value: Date): decimal {
     return value.Day;
   }

   public static hour(value: Date): decimal {
     return value.Hour;
   }

   public static minute(value: Date): decimal {
     return value.Minute;
   }

   public static second(value: Date): decimal {
     return value.Second;
   }

   public static years(end: Date, start: Date): decimal {
     return DateTimeSpan.CompareDates(end, start).Years;
   }

   public static months(end: Date, start: Date): decimal {
     return DateTimeSpan.CompareDates(end, start).Months;
   }

   public static days(end: Date, start: Date): decimal {
     return DateTimeSpan.CompareDates(end, start).Days;
   }

   public static hours(end: Date, start: Date): decimal {
     return DateTimeSpan.CompareDates(end, start).Hours;
   }

   public static minutes(end: Date, start: Date): decimal {
     return DateTimeSpan.CompareDates(end, start).Minutes;
   }

   public static seconds(end: Date, start: Date): decimal {
     return DateTimeSpan.CompareDates(end, start).Seconds;
   }
}
