

internal struct DateTimeSpan {
   // source https://stackoverflow.com/questions/4638993/difference-in-months-between-two-dates

   public number Years
   public number Months
   public number Days
   public number Hours
   public number Minutes
   public number Seconds
   public number Milliseconds

   dateTimeSpan(years: number, months: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number): public {
     Years = years;
     Months = months;
     Days = days;
     Hours = hours;
     Minutes = minutes;
     Seconds = seconds;
     Milliseconds = milliseconds;
   }

   private enum Phase {
     Years,
     Months,
     Days,
     Done
   }

   public static compareDates(date1: Date, date2: Date): DateTimeSpan {
     if (date2 < date1) {
       let sub = date1;
       date1 = date2;
       date2 = sub;
     }

     let current = date1;
     let years = 0;
     let months = 0;
     let days = 0;

     let phase = Phase.Years;
     let span = new DateTimeSpan();
     let officialDay = current.Day;

     while (phase != Phase.Done)
       switch (phase) {
         case Phase.Years:
           if (current.AddYears(years + 1) > date2) {
             phase = Phase.Months;
             current = current.AddYears(years);
           }
           else {
             years++;
           }

           break;
         case Phase.Months:
           if (current.AddMonths(months + 1) > date2) {
             phase = Phase.Days;
             current = current.AddMonths(months);
             if (current.Day < officialDay &&
               officialDay <= Date.DaysInMonth(current.Year, current.Month))
               current = current.AddDays(officialDay - current.Day);
           }
           else {
             months++;
           }

           break;
         case Phase.Days:
           if (current.AddDays(days + 1) > date2) {
             current = current.AddDays(days);
             let timespan = date2 - current;
             span = new DateTimeSpan(years, months, days, timespan.Hours, timespan.Minutes,
               timespan.Seconds, timespan.Milliseconds);
             phase = Phase.Done;
           }
           else {
             days++;
           }

           break;
       }

     return span;
   }
}
