# Call Lexy Functions

While we believe a simplified, transparent and consistent tax system, real-world Tax Laws are often still very complex.
They contain many exemptions and differences for different groups of people and geographical areas.
To keep large Lexy scripts readable and maintainable, it is possible to split functions into smaller functions with their own responsibility.
These functions can then be called from parent functions.

## Simple function call

In this example we have 3 different calculations with the similar parameters and the same results.
```
function TaxCalculationForIT
  Parameters
    number Income    
  Results
    number TaxRate
    number Tax
  Code
    TaxRate = 0.5
    Tax = Income * TaxRate

function TaxCalculationForGovernment
  Parameters
    number Income
    number Children
  Results
    number TaxRate
    number Tax
  Code
    if Children > 0
      TaxRate = 0.35
    else
      TaxRate = 0.4
    Tax = Income * TaxRate

function TaxCalculationForDefault
  Parameters
    number Income
  Results
    number TaxRate
    number ProvinceTax
    number Tax
  Code
    ProvinceTax = 0.06
    TaxRate = 0.4 
    Tax = Income * (TaxRate + ProvinceTax)
```

We can then implement a function that calls the 3 functions depending on value of
the `Industry` parameter.

```
function TaxCalculationPerIndustry
  Parameters
    string Industry
    number Income
    number Children
  Results
    number TaxRate
    number ProvinceTax
    number Tax
  Code
    switch Industry
      case "it"
        TaxCalculationForIT()
      case "government"
        TaxCalculationForGovernment()
      default
        TaxCalculationForDefault()
```

When calling a Lexy function without any parameters or results assigment it will automatically:
- Map the corresponding variables from the calling function, to the input parameters of the function
- Map the corresponding result from output of the called function, to variables of the calling function.

Any parameter or result variables that doesn't have a corresponding variable in the calling function will be ignored. There should be at least 1 matching parameter and result variable.

```
Scenario: TaxCalculationPerIndustryExamples
  function TaxCalculationPerIndustry
  ValidationTable
    | Industry     | Income | Children | TaxRate | Tax   | ProvinceTax |
    | "it"         | 100000 | 0        | 0.5     | 50000 | 0           |
    | "government" | 100000 | 0        | 0.4     | 40000 | 0           |
    | "government" | 100000 | 1        | 0.35    | 35000 | 0           |
    | "other"      | 100000 | 1        | 0.4     | 46000 | 0.06        |
```

## Declare new parameters variable

The `new` function will declare an empty complex type with default values.

```
function DeclareNewParameterObject
  Parameters
    number Income
    number Children
  Results
    TaxCalculationForIT.Results Result
  Code    
    var parameters = new(TaxCalculationForIT.Parameters)
    parameters.Income = Income
    Result = TaxCalculationForIT(parameters)

Scenario: DeclareNewParameterObjectExamples
  function DeclareNewParameterObject
  ValidationTable
    | Income | Children | Result.TaxRate | Result.Tax    |
    | 100000 | 0        | 0.5            | 50000         |
    | 200000 | 0        | 0.5            | 100000        |
```

## Fill parameters variable

The `fill` function will declare a new complex type variable and will map
evey variable value that correspond to a field in the complex type,
to the field of the variable.

```
function FillParameterObject
  Parameters
    number Income
    number Children
  Results
    TaxCalculationForIT.Results Result
  Code    
    var parameters = fill(TaxCalculationForIT.Parameters) 
    # parameters.Income and parameters.Children are filled by the fill function
    Result = TaxCalculationForIT(parameters)

Scenario: FillParameterObjectExamples
  function FillParameterObject
  ValidationTable
    | Income | Children | Result.TaxRate | Result.Tax    |
    | 100000 | 0        | 0.5            | 50000         |
    | 200000 | 0        | 0.5            | 100000        |
```

## Extract results variable

The `extract` function will extract all field values from a new complex type variable
to the corresponding variables in the calling function. Field without a
corresponding variable will be ignored.

```
function ExtractResultsObject
  Parameters
    number Income
    number Children
  Results
    number TaxRate
    number Tax
  Code    
    var parameters = fill(TaxCalculationForIT.Parameters)
    var results = TaxCalculationForIT(parameters)
    extract(results)         # Tax and TaxRate will be set

Scenario: ExtractResultsObjectExamples
  function ExtractResultsObject
  ValidationTable
    | Income | Children | TaxRate | Tax    |
    | 100000 | 0        | 0.5     | 50000  |
    | 200000 | 0        | 0.5     | 100000 |
```

# Next

🖥 ️📄 [Next topic: Scenarios](https://github.com/lexy-language/lexy-language/blob/main/Introduction/a_Scenarios.md)
