# lexy-language

[View demo!](https://lexy-language.github.io/lexy-editor/)

# Transparant and consistent Tax Laws

The mission of Lexy is to encourage governments to publish their Tax Laws as executable lexy scripts. It would ensure everyone knows how taxes are calculated, and that everyone adheres to the same rules.

View published executable [Tax Laws](https://github.com/lexy-language/lexy-language/blob/main/publications.md) written in Lexy.

# Philosophy

Lexy is a DSL (Domain Specific Language) designed by Tim Cools to describe tax laws. Currently, tax laws are published and updated with textual descriptions (Tax Laws), often ambiguous and open for interpretation. 
Besides that, the effective tax calculation code contains exceptions for individuals and companies which are sometimes not even approved by official laws or rulings.
The tax system in most countries favors people with a lot of money and/or influence who can pay expensive specialists to learn how to avoid paying taxes. This contributes to widening income and wealth inequality.

- What: Executable tax laws published by governments
- Who: Used by lawmakers, scientific researchers, tax specialists, IT companies implementing tax laws, and students.
- Why: Consistency and transparency: we believe tax returns should be published in public (as in some countries in Scandinavia)

Advantages:
- Official Tax Laws: when executable Tax Laws are published in a public Git repository, applications can always update to the latest version by getting the latest version of the laws. If the input for the Tax calculation isn't changed, that application does not need to be recompiled. Otherwise, it needs to provide the new input of course.
- Computer language independent: Calculations can be integrated into existing and new applications regardless of the language the application is written in. 
- Real-time execution: The calculations can be changed and executed in real-time, without recompiling the host application.
- Simple and readable: the goal is to keep the language as simple as possible. It should be readable by advanced (non-developer) spreadsheet users. 
- Transparency: during the execution of a lexy script every decision is logged for future reference
- Versioning: versioning can be accomplished by traditional development tools like git, or managed by the application itself.

Besides describing Tax Laws, the language can also be used to implement all kinds of calculations that benefit from these advantages. 

Hosting:
- Public portal/ Local IDE: lexy provides a [demo!](https://lexy-language.github.io/lexy-editor/) so you can learn more about the language.
- Any host programming language: currently dotnet and typescript/javascript
- Blockchain: Publishing laws on a blockchain, and calculating taxes on a blockchain was the initial idea. The main problem a blockchain solves is the decentralization of trust. While the lack of a central authority can be useful in some cases (a currency), this is only necessary when multiple organizations can't fully trust each other. We believe that governments should be able to trust themselves, and should be trusted by their citizens. So storing and executing tax scripts would be an irresponsible use of computing and storage resources. A blockchain that publicly publishes immutable lexy scripts, executes them, and publishes the results in public might have different use cases though.
- GPU

# How to get involved?

Do you like the mission and want to help it succeed? Do you have any of the following to contribute?

- Political Influence (Politician/Lobbyist/Activist)
- Knowledge of Tax Law (Student/Professor/Domain Expert/Developer)
- Software Developer
- Media (Journalist/Content Creator)
- Organisational (Management)
- Anything else you think of that can contribute to helping the mission succeed?

Then I'd love to hear from you? Please complete the [Get Involved](https://timsarahcools.com/lexy/get-involved/) form!
(It will take a few weeks before I get back to you, earliest 2nd half of March 2025)

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

- [ ] More scenarios for side cases and alternative branches of the current parser. Code coverage reveals validations, ... which are not verified in the language specifications yet

## Future ideas

- [ ] Tables: support of csv and/or json tables
- [ ] Syntax: support identifiers with underscore '_' (double underscores should not be allowed as it is reserved for system functions and variables)
- [ ] Versioning: document versioning strategy for lexy scripts in Git (branches) and how to reuse scripts (by using submodules) 
- [ ] Versioning: document versioning strategy for **lexy-langage** and its dependencies

# Implementations notes

## Submodules

**lexy-language** is included as a git submodule. 
- **lexy-language** is used in the automated tests to 
ensure that the parser and compiler are running against the latest lexy language specifications.

To update the submodule to the latest version: `cd tests/lexy-language/ && git pull` (ensure you pull the right branch is you're implementing a new branch of lexy-language)
