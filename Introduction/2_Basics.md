# Language Basics

The goals the Lexy Language is to be as simple as possible to describe very complicated Tax Laws.

## Keywords

Lexy contains 5 keywords that define the Lexy components.  

| Keyword    | Description 
|------------| -----------
| function   | A function is a callable unit of calculation logic that has a well-defined input (parameters) and output (results).
| enum       | A special data type that enables for a variable to be a set of predefined constants.
| table      | A data table which can be used to retrieve data
| type       | A custom complex data type defines multiple fields with their type that can be used throughout calculations
| scenario   | A scenario is an automated test used to validate the logic of a function.

Each of these keywords is covered in details in the following topics.

## Comments

Comments start with a #. Everything on a line after a # will be ignored by the compiler.

## Indentation

Indentation is used to determine the structure of a lexy script. Lexy support a strict indentation of 2 spaces or a tab. 
Component keywords are always placed at the first character of a line.
Children of keywords always use 2 spaces more as indentation as their parent.

```
function FirstFunction       // no indentation, start of a function component
  parameters                 // 2 spaces indentation, Parameters belongs to the function component declared above
    number Income            // 4 spaces indentation, the Income variable belongs to the Parameters of the defined Function
  results                    // 2 spaces indentation, Results belongs to the function component declared above
    number Tax               // 4 spaces indentation, the Tax variable belongs to the Results of the defined Function
    number TaxRate           // 4 spaces indentation, the TaxRate variable belongs to the Results of the defined Function
  Code                       // 2 spaces indentation, Code belongs to the function component declared above
    TaxRate = 0.5            // 4 spaces indentation, the assignment is part of the Code
    Tax = Income * TaxRate   // 4 spaces indentation, the assignment is part of the Code
                             // empty lines are ignored by the compiler
function SecondFunction      // no indentation, start of a new function component
```


# Next

🖥 ️📄 [Next topic: Example](https://github.com/lexy-language/lexy-language/blob/main/Introduction/3_Example.md)
