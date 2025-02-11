# lexy-language
🖥️ [Interactive DEMO! (Desktop only for now)](https://github.com/lexy-language/lexy-language/blob/main/Introduction/1_Philosophy.md)
📄 [Documentation! (On GitHub)](https://lexy-language.github.io/lexy-editor/)
## Transparent and consistent Tax Laws

The mission of Lexy is to encourage governments to publish their Tax Laws as executable lexy scripts. It would ensure everyone knows how taxes are calculated, and that everyone adheres to the same rules.

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
- Any host programming language: currently dotnet and typescript/javascript
- Blockchain: Publishing laws on a blockchain, and calculating taxes on a blockchain was the initial idea. The main problem a blockchain solves is the decentralization of trust. While the lack of a central authority can be useful in some cases (a currency), this is only necessary when multiple organizations can't fully trust each other. We believe that governments should be able to trust themselves, and should be trusted by their citizens. So storing and executing tax scripts would be an irresponsible use of computing and storage resources. A blockchain that publicly publishes immutable lexy scripts, executes them, and publishes the results in public might have different use cases though.
- GPU

## Learn More

🖥️ [Interactive DEMO! (Desktop only for now)](https://github.com/lexy-language/lexy-language/blob/main/Introduction/1_Philosophy.md) 
📄 [Documentation! (On GitHub)](https://lexy-language.github.io/lexy-editor/)

[![forthebadge](https://forthebadge.com/images/badges/license-mit.svg)](https://github.com/lexy-language/lexy-language/blob/main/README.md)

## How to get involved?

Do you like the mission and want to help it succeed? Do you have any of the following to contribute?

- Political Influence (Politician/Lobbyist/Activist)
- Knowledge of Tax Law (Student/Professor/Domain Expert/Developer)
- Software Developer
- Media (Journalist/Content Creator)
- Organisational (Management)
- Anything else you think of that can contribute to helping the mission succeed?

Then we'd love to hear from you? [Fill in the contact form to register as a contributor!](https://lucidmonk.live-website.com/lexy/get-involved/) - Reality is pretty crazy now 😊 So we'll ge back to you in a few weeks, probably second half of March. (Please only us for involvement in this project, anything else will be ignored!)

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

- [ ] More scenarios for side cases and alternative branches of the current parser. Code coverage reveals validations, ... which are not verified in the language specifications yet

## Future ideas

- [ ] Tables: support of csv and/or json tables
- [ ] Syntax: support identifiers with underscore '_' (double underscores should not be allowed as it is reserved for system functions and variables)
- [ ] Versioning: document versioning strategy for lexy scripts in Git (branches) and how to reuse scripts (by using submodules) 
- [ ] Versioning: document versioning strategy for **lexy-langage** and its dependencies
- [ ] Validation: check tables are sorted alphabetically.