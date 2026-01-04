# Built-in functions

Lexy defines a list of built-in functions used to manipulate numbers and dates, to retrieve data from a table, and to
declare fill and extract values from complex types.

## Number and Math Functions
Examples: [github](https://github.com/lexy-language/lexy-language/tree/main/Specifications/BuiltInFunctions/Number.lexy)

| function                   | description  | 
|----------------------------| ------------ |
| Number.Floor(value)        | Returns the integer part of a decimal number by rounding down to the integer |
| Number.Abs(value)          | Returns the absolute value of a number |
| Math.power(number, power)  | Returns the result of a number raised to a power |
| Math.round(number, digits) | Rounds a number to a specified number of digits  |

## Date Functions
Examples: [github](https://github.com/lexy-language/lexy-language/tree/main/Specifications/BuiltInFunctions/Date.lexy)

| function                           | returns | description
|------------------------------------| ------- | ------------------------------------------------------------ | 
| Date.Now()                         | date    | Returns current date and time
| Date.Today()                            | date    | Returns current date
| Date.Year(date value)                   | number  | Returns the year of a date value
| Date.Month(date value)                  | number  | Returns the month of a date value
| Date.Day(date value)                    | number  | Returns the day of the month of a date value
| Date.Hour(date value)                   | number  | Returns the hour of a date value
| Date.Minute(date value)                 | number  | Returns the minutes of a date value
| Date.Second(date value)                 | number  | Returns the seconds of a date value
| Date.Millisecond(date value)            | number  | Returns the seconds of a date value
| Date.Years(date end, date start)        | number  | Returns the number of years between two dates
| Date.Months(date end, date start)       | number  | Returns the number of months between two dates
| Date.Days(date end, date start)         | number  | Returns the number of days between two dates
| Date.Hours(date end, date start)        | number  | Returns the number of hours between two dates
| Date.Minutes(date end, date start)      | number  | Returns the number of minutes between two dates
| Date.Seconds(date end, date start)      | number  | Returns the number of seconds between two dates
| Date.Milliseconds(date end, date start) | number  | Returns the number of milliseconds between two dates

## Table Functions
Examples: 5_Tables and [github](https://github.com/lexy-language/tree/main/lexy-language/src/Specifications/Table/)

| function                                                                                                                      | description  | 
|-------------------------------------------------------------------------------------------------------------------------------| ----------------------------------
| Table.LookUp(lookUpValue, Table.SearchValueColumn, Table.ResultColumn)                                                        | Returns the value from a table of the row with corresponding search value
| Table.LookUpBy(discriminatorValue, lookUpValue, Table.DiscriminatorValueColumn, Table.SearchValueColumn, Table.ResultColumn) | Returns the value from a table of the row with corresponding discriminator and search value
| Table.LookUpRow(lookUpValue, Table.SearchValueColumn)                                                                        | Returns the row of a table with corresponding search value
| Table.LookUpRowBy(discriminatorValue, lookUpValue, Table.DiscriminatorValueColumn, Table.SearchValueColumn)                  | Returns the row of a table with corresponding discriminator and search value

## Complex type Functions

A complex type can be:
- Declared types: custom types declared in your Lexy scripts.
- Generated types: functions and tables generated a few types by details. They can be used in your Lexy script.

Examples: [github](https://github.com/lexy-language/lexy-language/tree/main/Specifications/BuiltInFunctions/)

| function          | returns | description
| ----------------- | ------- | -----------------------------------------------------------------------------
| new(complexType)  | generatedType | Initializes a new complex type variable with default values
| fill(complexType) | generatedType | Initializes a new complex type variable and fill the fields with the values of the corresponding variables
| extract(complexType) | {no return} | Extract all field values from the variable and set the value to the corresponding variables

# Next

🖥 ️📄 [Next topic: Call Functions](https://github.com/lexy-language/lexy-language/blob/main/Introduction/9_CallFunctions.md)
