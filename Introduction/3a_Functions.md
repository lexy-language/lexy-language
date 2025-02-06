# Functions

A function is a callable unit of calculation logic that has a well-defined input (parameters) and output (results). A function has parameter and result variables, these are defined under the Parameters and Results keywords. Parameters define the input variables of the function, Results define the output.

DEMO: You can execute the example functions on the right and see the results .

## Keywords

| Keyword    | Description
| ---------- | -----------
| Parameters | Declaration of the parameter variables
| Results    | Declaration of the result variables
| Code       | Calculation code statements

## Variable Types

Each variable needs a type, this is places before the variable name. Lexy support 4 primitive types:
- number: represents any number
- string: represents a string
- date: represents a date and time value
- boolean: represents true or false

```
Function: IfUsage
  Parameters
    boolean Married
    number Income
    string Province
    date BirthDate
  Results
    boolean HighEarner
    number TaxRate
    string TaxCode
    date TaxStatementDate
  Code
    # here comes the code
```

On top of this you can define your own Enum, Table and Complex types. They are covered in the next topics.

## Variable declaration in code

In a code block you can declare variables by specifying the type or using the `var` statement.

```
Function: VariableDeclaration
  Code
    boolean ExplicitBooleanVariable = true
    var ImplicitBooleanVariable = false
```

## Logic flow

### If

The `if`, `elseif` and `else` statements control the flow based on certain conditions.

```
Function: IfElseUsage
  Parameters
    boolean Married
    boolean TaxExemption
  Results
    number TaxRate
  Code
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
Function: SwitchUsage
  Parameters
    number Children
  Results
    number Deduction
  Code
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
Function: CalculationOperators
  Parameters
    number YearlyIncome
  Results
    number Add20k
    number Subtract20k
    number DiviseBy2
    number MultiplyBy40pct
    number Modulus3
    number ByPriority
  Code
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
Function: ComparisonOperators
  Parameters
    number YearlyIncome
  Results 
    boolean IsEqualTo20k
    boolean IsNotEqualTo20k
    boolean IsLesserThan20k
    boolean IsLesserThanOrEqual20k
    boolean IsGreaterThan20k
    boolean IsGreaterThanOrEqual20k
  Code
    IsEqualTo20k = YearlyIncome == 20000
    IsNotEqualTo20k = YearlyIncome != 20000
    IsLesserThan20k = YearlyIncome < 20000
    IsLesserThanOrEqual20k = YearlyIncome <= 20000
    IsGreaterThan20k = YearlyIncome > 20000
    IsGreaterThanOrEqual20k = YearlyIncome >= 20000
```