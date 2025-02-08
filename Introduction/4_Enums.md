# Enums

An enum represents a single value with a limited number of values. It is used to limit the number

```
Enum: MaritalStatus
  Single
  Married
  CivilPartnership
  Cohabiting
```

If used in a function, the input will be limited to these values. Check Execute Funtion on the right.

An If or Switch statement can be used in the code to calculate something different based on the existing values.

```
Function: EnumWithIfStatement
  Parameters
    MaritalStatus MaritalStatus
  Results
    number Tax
  Code
    if MaritalStatus == MaritalStatus.Single
      Tax = 0.45
    elseif MaritalStatus == MaritalStatus.Married
      Tax = 0.40
    else
      Tax = 0.42
```

```
Scenario: EnumWithIfStatementExamples
  Function EnumWithIfStatement
  ValidationTable
    | MaritalStatus            | Tax  |
    | MaritalStatus.Single     | 0.45 |
    | MaritalStatus.Married    | 0.40 |
    | MaritalStatus.Cohabiting | 0.42 |
```

```
Function: EnumWithSwitchStatement
  Parameters
    MaritalStatus MaritalStatus
  Results
    number Tax
  Code
    switch MaritalStatus
      case MaritalStatus.Single
        Tax = 0.45
      case MaritalStatus.Married
        Tax = 0.40
      case MaritalStatus.CivilPartnership
        Tax = 0.41
      case MaritalStatus.Cohabiting
        Tax = 0.42
```

```
Scenario: EnumWithSwitchStatementExamples
  Function EnumWithSwitchStatement
  ValidationTable
    | MaritalStatus                  | Tax  |
    | MaritalStatus.Single           | 0.45 |
    | MaritalStatus.Married          | 0.40 |
    | MaritalStatus.CivilPartnership | 0.41 |
    | MaritalStatus.Cohabiting       | 0.42 |
```