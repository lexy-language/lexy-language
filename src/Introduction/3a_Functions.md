# Functions

A function is a callable unit of calculation logic that has a well-defined input (parameters) and output (results). A function has parameter and result variables, these are defined under the Parameters and Results keywords. Parameters define the input variables of the function, Results define the output.

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
  Result
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
Function: IfUsage
  Parameters
    boolean Married
    boolean TaxExemption
  Result
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
  Result
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
  Code
    number Add20k = YearlyIncome + 20000       # explicit varable type
    var Subtract20k = YearlyIncome - 20000     # implicit varable type 
    var DiviseBy2 = YearlyIncome / 2
    var MultiplyBy40pct = YearlyIncome * 0.4
    var Modulus3 = YearlyIncome % 0.4
    var ByPriority = 0.4 * (YearlyIncome -  12000)
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
  Code
    boolean IsEqualTo20k = YearlyIncome == 20k         # explicit declaration
    var IsNotEqualTo20k = YearlyIncome != 20k          # implicit declaration
    var IsLesserThan20k = YearlyIncome < 20k
    var IsLesserThanOrEqual20k = YearlyIncome <= 20k
    var IsGreaterThan20k = YearlyIncome > 20k
    var IsGreaterThanOrEqual20k = YearlyIncome >= 20k
```

