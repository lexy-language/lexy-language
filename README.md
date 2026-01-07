# lexy-language
🖥️ [Interactive DEMO! (Web from a desktop browser only for now)](https://lexy-language.github.io/lexy-editor/)
📄 [Documentation! (On GitHub)](https://github.com/lexy-language/lexy-language/blob/main/Introduction/1_Philosophy.md)

## Lexy

The simplest programming language for implementing mathematical calculations and tax laws.

## Transparent and consistent Tax Laws

The mission of Lexy is to encourage governments to publish their Tax Laws as executable Lexy scripts. It would ensure everyone knows how taxes are calculated, and that everyone adheres to the same rules.

View published executable [Tax Laws](https://github.com/lexy-language/lexy-language/blob/main/publications.md) written in Lexy.

## Philosophy

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
- The Lexy script compiler can be implemented in any programming language. Current compilers: [typescript/javascript](https://github.com/lexy-language/lexy-typescript) and [.NET](https://github.com/lexy-language/lexy-dotnet) 
- Blockchain: Publishing and executing laws on a blockchain was Tim's initial idea. The main problem a blockchain solves is the decentralization of trust. While the lack of a central authority can be useful in some cases (a currency), this is only necessary when multiple organizations can't fully trust each other. We believe that governments should be able to trust themselves, and should be trusted by their citizens. So storing and executing tax scripts would be an irresponsible use of computing and storage resources. A blockchain that publicly publishes immutable lexy scripts, executes them, and publishes the results in public might have different use cases though.

## For developers

Lexy is a simple imperative procedural programming language. It supports functions, external libraries, arithmetic calculation and more advanced mathematical functions (todo).

For experienced programmer is should feel really familiar, the main difference between most (all?) other procedural programming languages is:
- The functions of most programming languages have a single return value, a Lexy function supports many result variables ([see doc](https://github.com/lexy-language/lexy-language/blob/main/Introduction/4_Functions.md))
- Functions can be called without specifying the parameter and result variables. All existing parameters and result variables are then mapped automatically. ([see doc](https://github.com/lexy-language/lexy-language/blob/main/Introduction/9_CallFunctions.md)) 

## Learn More

The documentation can be viewed in two ways:

🖥️ [Interactive DEMO! (Web from a desktop browser only for now)](https://lexy-language.github.io/lexy-editor/) 
📄 [Documentation! (On GitHub)](https://github.com/lexy-language/lexy-language/blob/main/Introduction/1_Philosophy.md)

Both contain the same information.

[![forthebadge](https://forthebadge.com/images/badges/license-mit.svg)](https://github.com/lexy-language/lexy-language/blob/main/README.md)

## How to get involved?

Do you like the mission and want to help it succeed? Do you have any of the following to contribute?

- Political Influence (Politician/Lobbyist/Activist)
- Knowledge of Tax Law (Student/Professor/Domain Expert/Developer)
- Software Developer
- Media (Journalist/Content Creator)
- Organisational (Management)
- Anything else you think of that can contribute to helping the mission succeed?

How can you help?
- Implement your local Tax Laws in Lexy and publish them in public on GitHub as examples. They can be added to the publications.md if they are fairly complete.
- Convert the compiler to other languages so you can run Lexy scripts in your favourite language or existing code-base? (java, php, ruby, c, c++, rust, ...)
- Demand governments to publish the real Tax Lax used in their system as an executable Lexy script. First step is to be fully transparent about how taxes are calculated and about which exemptions are in the code or hidden in the Tax rules.
- Moderate the Discord or help management of the GitHub projects

If you want to work on any of these, please discuss first on **Discord** so that people are not working on the same compiler for example:

[![](https://dcbadge.limes.pink/api/server/https://discord.gg/JmzvKNWFqE)](https://discord.gg/JmzvKNWFqE)

## Compilers

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/lexy-language/lexy-typescript)
[![Build lexy-typescript](https://github.com/lexy-language/lexy-typescript/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/lexy-language/lexy-typescript/actions/workflows/build.yml)
![Coverage](https://gist.githubusercontent.com/lexy-language/9179085a171f9629b868662611e06fbd/raw/badges.svg)

[![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://github.com/lexy-language/lexy-dotnet)
[![Build lexy-dotnet](https://github.com/lexy-language/lexy-dotnet/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/lexy-language/lexy-dotnet/actions/workflows/build.yml)
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/lexy-language/5cd196aad8e9065cdba88b922a8d7bd6/raw/coverage.svg)

## Editor

[![Build lexy-editor](https://github.com/lexy-language/lexy-editor/actions/workflows/build.yml/badge.svg)](https://github.com/lexy-language/lexy-editor/actions/workflows/build.yml)

## Known improvements

- [ ] More scenarios for side cases and alternative branches of the current parser. Code coverage reveals validations and code paths which are not verified in the language specifications yet

## Future ideas

Please discuss with main maintainers before creating any pull requests!

- [x] Syntax: inline function calls: support calling functions with parameters as argument without auto mapping or creating an parameters variable. Example: "var result = Function1(5, Input, "abc")"
- [ ] Syntax: function calls: we need a specific syntax for auto mapping parameters and results. Probably the spread syntax '...'. Example "... TaxCalculationForGovernment( ... )" or "... = TaxCalculationForIT( ... )"
- [ ] Syntax: add logging support
- [ ] Syntax: expose parameters and results object (allow use of a custom parameters/results type?)
- [ ] Syntax: inline parameters and results "function (number TaxRate, number Tax) CalculatePersonalTax (number Income, string Department)"
- [ ] Syntax: type functions: shall we add functions to declared object types?
- [ ] Syntax: include pre-compiled lexy scripts
- [ ] Syntax: support identifiers with underscore '_' (double underscores should not be allowed as it is reserved for system functions and variables)
- [ ] Syntax: for and while loop
- [ ] Syntax: arrays and lists
- [ ] Tables: support of csv, json, ... tables
- [ ] Parsing: allow recursive execution of Lexy functions (optional with a compiler directive)
- [ ] Documentation: add detailed (executable) documentation
- [ ] Versioning: document versioning strategy for lexy scripts in Git (branches) and how to reuse scripts (by using submodules)
- [ ] Versioning: roadmap to version 1 and document versioning strategy for **lexy-language** and its dependencies
- [ ] Validation: check tables are sorted alphabetically 
- [ ] Tools: command line tools run, compile, test lexy script
- [ ] Tools: (batch/ui) tool to process (stream large) data sets with a lexy function. UI to analyse unstructured (cvs) files and to generate fault tolerant processing Lexy code.
- [ ] Tools: visualizations
- [ ] Libraries: add string processing, statistics, matrices, processing data from files, json/yaml, call api, dsp, ... (only if you really need it!)
- [ ] Blockchain: a blockchain running official Lexy Tax Laws by governments verified by it's citizens 
