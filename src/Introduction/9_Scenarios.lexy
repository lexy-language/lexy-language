# Lexy has built in automated testing. A scenario describes the parameters and the expected results of a specific function. Adding a scenario for each option in the tax calculation ensures that the code still works as expected after the function code is updated or refactored.

Function: NaiveTaxLaw
  Parameters
    number Income
  Results
    number TaxValue
    number Tax
  Code
    TaxValue = 0.6
    if Income < 40000
      TaxValue = 0.5
    if Income < 30000
      TaxValue = 0.4
    if Income < 20000
      TaxValue = 0.3
    if Income < 15000
      TaxValue = 0.2

    Tax = Income * TaxValue


Scenario: NaiveTaxLaw40k
  Function NaiveTaxLaw
  Parameters
    Income = 40000
  Results
    TaxValue = 0.6
    Tax = 24000

# You can find the result of the executed scenarios below under 'Test Logging'. If you change any of the values in the functino code, or in the scenario, the scenario will turn red.

# Scenarios also supports a validation table which


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
    | 1000000 | 0.6      | 60000 |


# The lexy language itself is described with a collection of lexy scenarios. They define the expected output behvior and even expected compilation and validation errors. These specifications ensure that all lexy compiler implementations in all different languages have the same expected behavior. Have a look at the 'Specifications' folder to see the language specification.