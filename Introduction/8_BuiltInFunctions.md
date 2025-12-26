# Built-in functions

Lexy defines a list of built-in functions used to manipulate numbers and dates, to retrieve data from a table, and to
declare fill and extract values from complex types.

## number Functions
Examples: [github](https://github.com/lexy-language/lexy-language/tree/main/Specifications/BuiltInFunctions/Number.lexy)

| function              | description  | 
| --------------------- | ------------ |
| int(value)            | Returns the integer part of a decimal number by rounding down to the integer |
| abs(value)            | Returns the absolute value of a number |
| power(number, power)  | Returns the result of a number raised to a power |
| round(number, digits) | Rounds a number to a specified number of digits  |

##date Functions
Examples: [github](https://github.com/lexy-language/lexy-language/tree/main/Specifications/BuiltInFunctions/Date.lexy)

| function                           | returns | description
|------------------------------------| ------- | ------------------------------------------------------------ | 
| now()                              | date    | Returns current date and time
| today()                            | date    | Returns current date
| year(date value)                   | number  | Returns the year of a date value
| month(date value)                  | number  | Returns the month of a date value
| day(date value)                    | number  | Returns the day of the month of a date value
| hour(date value)                   | number  | Returns the hour of a date value
| minute(date value)                 | number  | Returns the minutes of a date value
| second(date value)                 | number  | Returns the seconds of a date value
| millisecond(date value)            | number  | Returns the seconds of a date value
| years(date end, date start)        | number  | Returns the number of years between two dates
| months(date end, date start)       | number  | Returns the number of months between two dates
| days(date end, date start)         | number  | Returns the number of days between two dates
| hours(date end, date start)        | number  | Returns the number of hours between two dates
| minutes(date end, date start)      | number  | Returns the number of minutes between two dates
| seconds(date end, date start)      | number  | Returns the number of seconds between two dates
| milliseconds(date end, date start) | number  | Returns the number of milliseconds between two dates

## date Functions
Examples: 5_Tables and [github](https://github.com/lexy-language/tree/main/lexy-language/src/Specifications/Table/)

| function                                                                                                                      | description  | 
------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------
| lookUp(Table, lookUpValue, Table.SearchValueColumn, Table.ResultColumn)                                                       | Returns the value from a table of the row with corresponding search value
| lookUpBy(Table, discriminatorValue, lookUpValue, Table.DiscriminatorValueColumn, Table.SearchValueColumn, Table.ResultColumn) | Returns the value from a table of the row with corresponding discriminator and search value
| lookUpRow(Table, lookUpValue, Table.SearchValueColumn)                                                                        | Returns the row of a table with corresponding search value
| lookUpRowBy(Table, discriminatorValue, lookUpValue, Table.DiscriminatorValueColumn, Table.SearchValueColumn)                  | Returns the row of a table with corresponding discriminator and search value

## complex type Functions
Examples: [github](https://github.com/lexy-language/lexy-language/tree/main/Specifications/BuiltInFunctions/)

| function          | returns | description
| ----------------- | ------- | -----------------------------------------------------------------------------
| new(complexType)  | complexType | Declares a new complex type variable with default values
| fill(complexType) | complexType | Declares a new complex type variable and fill the fields with the values of the corresponding variables
| extract(variable) | {no return} | Extract all field values from the variable and set the value to the corresponding variables

# Next

🖥 ️📄 [Next topic: Call Functions](https://github.com/lexy-language/lexy-language/blob/main/Introduction/9_CallFunctions.md)
