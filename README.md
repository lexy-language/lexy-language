# lexy-language

[View demo!](https://lexy-language.github.io/lexy-demo/)

# Philosophy

Lexy is a DSL (Domain Specific Language) designed to describe tax laws. Currently tax laws are published and updated with, sometimes ambiguos, textual description. 
The tax system in most countries does favor people with a lot of money who can pay expensive spcialists to learn how to avoid paying taxes. This contributes to widening the income and wealth inequality.

- What: Executable tax laws published by governments
- Who: Used by law makers, scientific researchers, tax specialist, IT companies implementing tax laws, students.
- Why: Consitency and Transparancy: we believe tax returns should be published in public (as some countries in scandinavia)


Besides tax laws the language can be used to implement all kind of calculations. 

Advantages:
- Computer language independent: calculations can be included in many existing and new application regaderless the language it is written in
- Real-time execution: The calculations can be changed and executes without the need to recompile the main application. 
- Simple and readable: the goal is to keep the language as simple as possible. It should be readable by advanced (non-developer) users of spreadsheets. UI's can be maded to update parts of the calculation
- Transpaancy: during the execution of a lexy script every decicion is logged
- Versioning: 

Hosting
- Public portal/ Local IDE
- Any host programming language: currently dotnet and typescript/javascript
- Blockchain: was initial idea. Only necessary when multiple organisations can't fully trust eachother. Government should be able to trust itself.  It would irresponsible use of comuting and storage resources. A blockchain that publicly publishes immutable lexy scripts, executes them and publishes the results in public might have different use-cases though.
- GPU

# How to contribute?

Tax specialist with IT knowledge, developers with Tax knowledge
Govenements
Developers with interest in parsers and compilers


# Syntax

## Function

`Function: HelloWorld`

## Enum

```
Enum: MaritalStatus
  Single
  Married
```

## Type
## Table
## Scenario

# Language Specifications

## Scenario

# Setup

## Run locally

Each parser shou
[lexy-dotnet](https://github.com/lexy-language/lexy-dotnet) or [lexy-typescript](https://github.com/lexy-language/lexy-typescript) run these specfications to validate the outcome in their automated tests.


## Known improvements

- [ ] More scenario's for side cases and alternative branches of the current parser. Code coverare reveals validations, ... which are not verified in the language specifications yet

## Future ideas

- [ ] Tables: support of csv and/or json tables
- [ ] Syntax: support **for** loop
- [ ] Syntax: support **while** loop
- [ ] Syntax: support of arrays
- [ ] Versioning: document versioning strategy for lexy scripts (branches) and how to reuse scripts (by using submodules) 
- [ ] Versioning: document versioning strategy for **lexy-langage** and it's dependencies


# Implementations notes

## Submodules

**lexy-language** is included as a git submodule. 
- **lexy-language** is used in the automated tests to 
ensure that the parser and compiler are running against the latest lexy language specifications.

To update the submodule to the latest version: `cd tests/lexy-language/ && git pull` (ensure you pull the right branch is you're implementing a new branch of lexy-language)

## Circular references
`import type`