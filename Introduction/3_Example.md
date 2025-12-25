# Example

A function is a callable unit of calculation logic that has a well-defined input (parameters) and output (results). A function has parameter and result variables, these are defined under the Parameters and Results keywords. Parameters define the input variables of the function, Results define the output.

## Function

```
function NaiveFlatTaxLaw
// calculate imaginary tax statement for demo purposes (amounts are in  €)
  parameters
    number GrossIncomeYear
  results
    number TaxableIncomeYear
    number TaxRate
    number TotalTax
  Code
    TaxRate = 0.40                                   // 40% income tax
    TaxableIncomeYear = GrossIncomeYear - 12000      // 12000 contribution for demo purposes
    TotalTax = TaxableIncomeYear * TaxRate
```

On the right in the UI you can execute the function, for example enter 45000 and press the Execute button. It will show you the results variables of the function. If you click Execution Logging below, you can see all the execute lines and the variables used on this line. This can be stored for transparency and debugging.

Lexy has built in automated testing to describe the desire behavior of a function. These are called a Scenario. Scenarios are useful to specific the expected results while executing a function with certain parameters. They are useful to ensure functions keeps working after the code is updated or refactored.

## Scenario

```
scenario NaiveFlatTaxLawSpecifications
  function NaiveFlatTaxLaw
  parameters
    GrossIncomeYear = 120000
  results
    TaxableIncomeYear = 108000
    TaxRate = 0.4
    TotalTax = 43200
```

Scenarios are validated in real time. You can find the result under 'Test Logging' below. Try to change the code or any of the numbers in the scenario to see the scenario failing.

# Next

🖥 ️📄 [Next topic: Example](https://github.com/lexy-language/lexy-language/blob/main/Introduction/4_Functions.md)
