# Enums

An enum represents a single value with a limited number of values. It is used to limit the number

```
enum MaritalStatus
  Single
  Married
  CivilPartnership
  Cohabiting
```

If used in a function, the input will be limited to these values. Check Execute Funtion on the right.

An If or Switch statement can be used in the code to calculate something different based on the existing values.

```
function EnumWithIfStatement
  parameters
    MaritalStatus MaritalStatus
  results
    number Tax
  if MaritalStatus == MaritalStatus.Single
    Tax = 0.45
  elseif MaritalStatus == MaritalStatus.Married
    Tax = 0.40
  else
    Tax = 0.42
```

```
scenario EnumWithIfStatementExamples
  function EnumWithIfStatement
  validationTable
    | MaritalStatus            | Tax  |
    | MaritalStatus.Single     | 0.45 |
    | MaritalStatus.Married    | 0.40 |
    | MaritalStatus.Cohabiting | 0.42 |
```

```
function EnumWithSwitchStatement
  parameters
    MaritalStatus MaritalStatus
  results
    number Tax

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
scenario EnumWithSwitchStatementExamples
  function EnumWithSwitchStatement
  validationTable
    | MaritalStatus                  | Tax  |
    | MaritalStatus.Single           | 0.45 |
    | MaritalStatus.Married          | 0.40 |
    | MaritalStatus.CivilPartnership | 0.41 |
    | MaritalStatus.Cohabiting       | 0.42 |
```

# Next

🖥 ️📄 [Next topic: Types](https://github.com/lexy-language/lexy-language/blob/main/Introduction/6_Types.md)
