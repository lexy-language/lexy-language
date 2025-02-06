# Scenarios

Lexy has built in automated testing. A scenario describes the parameters and the expected results of a specific function. Adding a scenario for each option in the tax calculation ensures that the code still works as expected after the function code is updated or refactored.

## Keywords

| Keyword    | Description
| ---------- | -----------
| Function   | Name of the function to test
| Parameters | Parameter variables used to execute the function
| Results    | Expected result variable values

## Example

DEMO: check 'Test Logging' for the execute scenario result. Modify any code or values to see the effect in the logging.
```
Function: NaiveTaxLaw
  Parameters
    number Income
  Results
    number TaxValue
    number Tax
  Code
    if Income < 15000
      TaxValue = 0.2
    elseif Income < 20000
      TaxValue = 0.3
    elseif Income < 30000
      TaxValue = 0.4
    elseif Income < 40000
      TaxValue = 0.5
    else
      TaxValue = 0.6

    Tax = Income * TaxValue
```

```
Scenario: NaiveTaxLaw40k
  Function NaiveTaxLaw
  Parameters
    Income = 40000
  Results
    TaxValue = 0.6
    Tax = 24000
```

DEMO: You can find the result of the executed scenarios below under 'Test Logging'. If you change any of the values in the function code, or in the scenario, the scenario will turn red.

## Validation Table

Scenarios also supports a validation table which allows to validate many scenarios from a single table.

```
Scenario: NaiveTaxLawScenarios
  Function NaiveTaxLaw
  ValidationTable
    | Income  | TaxValue | Tax   |
    | 12000   | 0.2      | 2400  |
    | 18000   | 0.3      | 5400  |
    | 20000   | 0.4      | 8000  |
    | 30000   | 0.5      | 15000 |
    | 40000   | 0.6      | 24000 |
    | 80000   | 0.6      | 48000 |
    | 100000  | 0.6      | 60000 |
```

## Nested Parameters and results
There are two ways to define nested parameters and results in scenarios.
- By using a point `.` to access the field of the variable. Eg: `Variable.Field`
- By using a point `.` to access the field of the variable. Eg: `Variable.Field`

```
Type: CustomParameters
  number NumberValue
  string TextValue
  
Type: CustomResults
  number NumberResult
  string TextResult

Function: AssignNestedFields
  Parameters
    CustomParameters Values
  Results
    CustomResults Result
  Code
    Result.NumberResult = Values.NumberValue
    Result.TextResult = Values.TextValue
```

Use a point `.` to access the field of variable.

```
Scenario: NestedFieldsWithMemberAccessor
  Function AssignNestedFields
  Parameters
    Values.NumberValue = 777
    Values.TextValue = "abc"
  Results
    Result.NumberResult = 777
    Result.TextResult = "abc"
```

Use indentation of define the fields of a parent variable.

```
Scenario: NestedFieldsWithNesting
  Function AssignNestedFields
  Parameters
    Values =
      NumberValue = 777
      TextValue = "abc"
  Results
    Result = 
      NumberResult = 777
      TextResult = "abc"
```

In a ValidationTable it's also possible to access the fields of a variable:

```
Scenario: NestedFieldsWithTable
  Function AssignNestedFields
  ValidationTable
    | Values.NumberValue | Values.TextValue | Result.NumberResult | Result.TextResult | 
    | 5                  | "abc"            | 5                   | "abc"             |   
    | 8                  | "def"            | 8                   | "def"             |
```