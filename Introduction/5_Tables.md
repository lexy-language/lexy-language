#Tables

Tables store rows of values in a specific format. The column names and types are defined by the first row, the header of the table.

# Table Syntax

- A pipe is used te separate columns in a table `|`
- A table header starts and ends and with a separator, and puts a separator in between each column. Each column definition starts with the type followed by the name of the column.  Only primitive types and enums are supported: boolean, string, number, date and custom defined enums.
- A table row starts and ends and with a separator, and puts a separator in between each column. Each column contains the specific value.

```
Table: AverageTaxPerCanton
# In Zwiterland income tax varies per canton, this is a simplified example as the tax depends on branckets and can variy from from canton to canton, and even from town to town.
# Source: https://www.academics.com/guide/taxes-switzerland
  | string Canton | number AverageTax |
  | "Basel"       | 0.3783            |
  | "Bern"        | 0.4107            |
  | "Luzern"      | 0.3003            |
  | "St. Gallen"  | 0.2939            |
  | "Zurich"      | 0.3718            |  
```

## Table Functions

A value or a row can be looked up by using the built-in `LOOKUP` or the `LOOKUPROW` function.
- The `LOOKUP`function returns a specific value from the `resultColumn` column.
- The `LOOKUPROW`function returns the whole row.

The functions will loop over all rows in a table from the starts and will compare the value of a specific column `searchValueColumn` with the defined `lookUpValue`.
- If the value in the column equals the `lookUpValue`, the value in the `resultColumn` or row is returned.
- If the value in the column exceeds the `lookUpValue`, the value `resultColumn` of the previous row or the previous row is returned.

**NOTE: table search value columns should be sorted from small to large in order these functions to work correctly. This also applies to string columns, they should be sorted alphabetically.**

Examples: [github](https://github.com/lexy-language/lexy-language/tree/main/Specifications/Table/)

Syntax: `LOOKUP(Table, lookUpValue, Table.searchValueColumn, Table.resultColumn)`

```
Function: LookupAveragteTax
  Parameters
    string Canton
    number Income
  Results
    number TaxRate
    number Tax
  Code
    TaxRate = LOOKUP(AverageTaxPerCanton, Canton, AverageTaxPerCanton.Canton, AverageTaxPerCanton.AverageTax)
    Tax = Income * TaxRate
```

```
Scenario: LookupAveragteTaxExamples
  Function LookupAveragteTax
  ValidationTable
    | Canton        | Income | TaxRate | Tax   |
    | "Basel"       | 100000 | 0.3783  | 37830 |
    | "Bern"        | 100000 | 0.4107  | 41070 |
    | "Zurich"      | 100000 | 0.3718  | 37180 |
    | "Luzern"      | 100000 | 0.3003  | 30030 |
    | "St. Gallen"  | 100000 | 0.2939  | 29390 |
```

Syntax: `LOOKUPROW(Table, lookUpValue, Table.searchValueColumn, Table.resultColumn)`

```
Function: LookupRowAveragteTax
  Parameters
    string Canton
    number Income
  Results
    number TaxRate
    number Tax
  Code
    var row = LOOKUPROW(AverageTaxPerCanton, Canton, AverageTaxPerCanton.Canton)
    TaxRate = row.AverageTax
    Tax = Income * TaxRate
```

```
Scenario: LookupRowAveragteTaxExamples
  Function LookupRowAveragteTax
  ValidationTable
    | Canton        | Income | TaxRate | Tax   |
    | "Basel"       | 100000 | 0.3783  | 37830 |
    | "Bern"        | 100000 | 0.4107  | 41070 |
    | "Zurich"      | 100000 | 0.3718  | 37180 |
    | "Luzern"      | 100000 | 0.3003  | 30030 |
    | "St. Gallen"  | 100000 | 0.2939  | 29390 |
```

## Discriminator

A discriminator field can be used as an additional condition to retrieve data from a table.

```
Table: YearlyTaxRate
  | number Year | number Max | number Rate |
  | 2023        | 0          | 0.4         |
  | 2023        | 20000      | 0.45        |
  | 2023        | 30000      | 0.5         |
  | 2024        | 0          | 0.41        |
  | 2024        | 22000      | 0.451       |
  | 2024        | 33000      | 0.51        |
  | 2025        | 0          | 0.42        |
  | 2025        | 23000      | 0.452       |
  | 2025        | 35000      | 0.52        |
```

A value or a row can be looked up by discriminator using the built-in `LOOKUPBY` or the `LOOKUPROWBY` function.
- The `LOOKUPBY`function returns a specific value from the `resultColumn` column.
- The `LOOKUPROWBY`function returns the whole row.

The functions will loop over all rows in a table from the starts and, if the discriminator matched, it will compare the value of a specific column `searchValueColumn` with the defined `lookUpValue`.
- If the value in the column equals the `lookUpValue`, the value in the `resultColumn` or row is returned.
- If the value in the column exceeds the `lookUpValue`, the value `resultColumn` of the previous row or the previous row is returned.

Syntax: `LOOKUPBY(Table, discriminator, lookUpValue, Table.discriminatorColumn, Table.searchValueColumn, Table.resultColumn)`

```
Function: LookupByYearAndMax
  Parameters
    number Year
    number Income
  Results
    number TaxRate
    number Tax
  Code
    TaxRate = LOOKUPBY(YearlyTaxRate, Year, Income, YearlyTaxRate.Year, YearlyTaxRate.Max, YearlyTaxRate.Rate)
    Tax = Income * TaxRate
```

``` 
Scenario: LookupByYearAndMaxExamples
  Function LookupByYearAndMax
  ValidationTable
    | Year | Income | TaxRate | Tax        |
    | 2023 | 10000  | 0.4     | 4000       | 
    | 2023 | 20000  | 0.45    | 9000       | 
    | 2023 | 40000  | 0.5     | 20000      |  
    | 2024 | 13000  | 0.41    | 5330       |  
    | 2024 | 23500  | 0.451   | 10598.5    | 
    | 2024 | 32999  | 0.451   | 14882.549  |  
    | 2025 | 16000  | 0.42    | 6720       | 
    | 2025 | 24000  | 0.452   | 10848      | 
    | 2025 | 45000  | 0.52    | 23400      |  
```

Syntax: `LOOKUPROWBY(Table, discriminator, lookUpValue, Table.discriminatorColumn, Table.searchValueColumn)`

```
Function: LookupRowByYearAndMax
  Parameters
    number Year
    number Income
  Results
    number TaxRate
    number Tax
  Code
    var row = LOOKUPROWBY(YearlyTaxRate, Year, Income, YearlyTaxRate.Year, YearlyTaxRate.Max)
    TaxRate = row.Rate
    Tax = Income * TaxRate
```

```
Scenario: LookupRowByYearAndMaxExamples
  Function LookupRowByYearAndMax
  ValidationTable
    | Year | Income | TaxRate | Tax     |
    | 2024 | 10000  | 0.41    | 4100    | 
```

## Future

In the future features:
- Tables will be editable from the UI
- Include csv files in your lexy scripts