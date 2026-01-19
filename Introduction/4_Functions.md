# Functions

A function is a callable unit of calculation logic that has a well-defined input (parameters) and output (results). A function has parameter and result variables, these are defined under the *parameters* and *results* keywords. *parameters*  define the input variables of the function, *results* define the output.

DEMO: You can execute the example functions on the right and see the results .

## Keywords

| Keyword    | Description
| ---------- | -----------
| Parameters | Declaration of the parameter variables
| Results    | Declaration of the result variables

## Variable Types

Each variable needs a type, this is places before the variable name. Lexy support 4 value types:
- number: represents any number
- string: represents a string
- date: represents a date and time value
- boolean: represents true or false

```
function IfUsage
  parameters
    boolean Married
    number Income
    string Province
    date BirthDate
  results
    boolean HighEarner
    number TaxRate
    string TaxCode
    date TaxStatementDate
    
  // here comes the code (2 spaces indentation)
```

On top of this you can define your own Enum, Table and Object types. They are covered in the next topics.

## Variable declaration in code

In a code block you can declare variables by specifying the type or using the `var` statement.

```
function VariableDeclaration
  boolean ExplicitBooleanVariable = true
  var ImplicitBooleanVariable = false
```

## Logic flow

### If

The `if`, `elseif` and `else` statements control the flow based on certain conditions.

```
function IfElseUsage
  parameters
    boolean Married
    boolean TaxExemption
  results
    number TaxRate
    
  if TaxExemption
    TaxRate = 0
  elseif Married
    TaxRate = 0.4
  else
    TaxRate = 0.5    
```

### Switch

A `switch` statement controls the flow of the code  based on a cetain value. A `case` statement defines the value, a `default` statement is executed when none of the cases matched.

```
function SwitchUsage
  parameters
    number Children
  results
    number Deduction
    
  switch Children
    case 0
      Deduction = 0
    case 1
      Deduction = 6000
    case 2
      Deduction = 10000
    case 3
      Deduction = 14000
    default
      Deduction = 17000
```

## Calculation Operators

You can use the following operators to compare variables. The result of comparing two variables is a `boolean`.

| Operator | Description
| -------- | -----------
| =        | Assignment
| +        | Addition
| -        | Subtraction
| *        | Addition
| /        | Division
| %        | Modulus
| ( )      | Define the priority of a calculation statement

```
function CalculationOperators
  parameters
    number YearlyIncome
  results
    number Add20k
    number Subtract20k
    number DiviseBy2
    number MultiplyBy40pct
    number Modulus3
    number ByPriority
    
  Add20k = YearlyIncome + 20000     
  Subtract20k = YearlyIncome - 20000
  DiviseBy2 = YearlyIncome / 2
  MultiplyBy40pct = YearlyIncome * 0.4
  Modulus3 = YearlyIncome % 200
  ByPriority = 0.4 * (YearlyIncome -  12000)
```

## Comparison Operators

You can use the following operators to compare variables. The result of comparing two variables is a `boolean`.

| Operator | Description
| -------- | -----------
| ==       | Checks whether two variables are equal
| !=       | Checks whether two variables are not equal
| <        | Checks whether one variable is lesser than another variable
| \>       | Checks whether one variable is lesser than or equal another variable
| <=       | Checks whether one variable is greater than another variable
| \>=      | Checks whether one variable is greater than or equal another variable

```
function ComparisonOperators
  parameters
    number YearlyIncome
  results 
    boolean IsEqualTo20k
    boolean IsNotEqualTo20k
    boolean IsLesserThan20k
    boolean IsLesserThanOrEqual20k
    boolean IsGreaterThan20k
    boolean IsGreaterThanOrEqual20k

  IsEqualTo20k = YearlyIncome == 20000
  IsNotEqualTo20k = YearlyIncome != 20000
  IsLesserThan20k = YearlyIncome < 20000
  IsLesserThanOrEqual20k = YearlyIncome <= 20000
  IsGreaterThan20k = YearlyIncome > 20000
  IsGreaterThanOrEqual20k = YearlyIncome >= 20000
```

# Next

🖥 ️📄 [Next topic: Enums](https://github.com/lexy-language/lexy-language/blob/main/Introduction/5_Enums.md)
