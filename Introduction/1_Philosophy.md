# Lexy Language v0.1

This introduction is a series of lexy scrips that describe the purpose of Lexy and how to us it. You can navigate through the files of the introduction by using the buttons the menu bar on the right.

Lexy is a DSL (Domain Specific Language) designed by Tim Cools to describe Tax Laws. Currently, official Tax Laws are published and updated with textual descriptions and rulings (Tax Laws), often ambiguous and open for interpretation.

Besides, the effective tax calculation code contains exceptions for individuals and companies which are sometimes not even approved by official laws or rulings.

The tax system in most countries favors people with a lot of money and/or influence who can pay expensive specialists to learn how to avoid paying taxes.

This contributes to widening income and wealth inequality.

- What: Executable tax laws published by governments
- Who: Used by lawmakers, scientific researchers, tax specialists,
  IT companies implementing tax laws, and students.
- Why: Consistency and transparency: we believe tax returns
  should be published in public (as in some countries in Scandinavia)

Advantages:
- Official Tax Laws: when executable Tax Laws are published in a public Git repository, applications can always update to the latest version by getting the latest version of the laws. If the input for the Tax calculation isn't changed, that application does not need to be recompiled. Otherwise, it needs to provide the new input of course.
- Computer language independent: Calculations can be integrated into existing and new applications regardless of the language the application is written in.
- Real-time execution: The calculations can be changed and executed in real-time, without recompiling the host application.
- Simple and readable: the goal is to keep the language as simple as possible. It should be readable by advanced (non-developer) spreadsheet users.
- Transparency: during the execution of a lexy script every decision is logged for future reference
- Versioning: versioning can be accomplished by traditional development tools like git, or managed by the application itself.

Besides describing Tax Laws, the language can also be used to implement all kinds of calculations that benefit from these advantages.

Hosting:
- Public portal/ Local IDE: lexy provides a [demo!](https://lexy-language.github.io/lexy-demo/)
- Any host programming language: currently dotnet and typescript/javascript
- Blockchain: Publishing laws on a blockchain, and calculating taxes on a blockchain was the initial idea. The main problem a blockchain solves is the decentralization of trust. While the lack of a central authority can be useful in some cases (a currency), this is only necessary when multiple organizations can't fully trust each other. We believe that governments should be able to trust themselves, and should be trusted by their citizens. So storing and executing tax scripts would be an irresponsible use of computing and storage resources. A blockchain that publicly publishes immutable lexy scripts, executes them, and publishes the results in public might have different use cases though.
- GPU

Hello world example

```
Function: HelloWorld
  Results
    string Result
  Code
    Result = "World Peace ☮️"
```

Execute this simple function by pressing the 'Execute' button on the right.

Lexy has automated tests built into the language. Scenarios are execute in real-time in the IDE.

```
Scenario: HelloWorldPeace
  Function HelloWorld
  Results
    Result = "World Peace ☮️"
```

Check the 'Test Logging' below for the automated tests logging.


## How to use the editor

DEMO: This editor supports both `lexy` as `md` (markup files). All lexy code, also the code embedded in `md` files, is
parsed and compiled in real time. All automated tests are also executed in real-time. You can always edit the source code
to see how the parser react.

- All files in this demo an introduction can be found in 'Explorer' on the left.
- Parsed components of the file can be found in 'Structure' on the left. You can use it to naviagte to the corresponding source line.
- Execute a function from the current file on the right.
- After execution, you can view a detailed log of the execution under 'Execution Logging'.
- You find real-time compilation errors in the 'Logging' below.
- All scenarios (lexy automated tests) are executed in real time. You find the feedback in 'Test Logging' below.

