import {FunctionCall} from "../builtInFunctions/functionCall";
import {firstOrDefault} from "../../../infrastructure/enumerableExtensions";
import {FunctionCallExpression} from "../../../language/expressions/functionCallExpression";

export class CodeWriter {
  private readonly builder: Array<string> = [];
  private readonly namespace;
  private indent = 0;
  private currentLineValue = 0;
  private functionCalls: Array<FunctionCall>;

  constructor(namespace: string, functionCalls: Array<FunctionCall> = []) {
    this.namespace = namespace;
    this.functionCalls = functionCalls;
  }

  public get currentLine() {
    return this.currentLineValue;
  }

  startLine(value: string | null = null) {
    if (value != null) {
      this.builder.push(this.indentString() + value);
    } else {
      this.builder.push(this.indentString());
    }
  }

  endLine(value: string | null = null) {
    if (value != null) {
      this.builder.push(value + "\n");
    } else {
      this.builder.push("\n");
    }
    this.currentLineValue++;
  }

  writeLine(value: string) {
    this.builder.push(this.indentString() + value + "\n");
    this.currentLineValue++;
  }

  write(value: string) {
    this.builder.push(value);
  }

  writeNamespace() {
    this.builder.push(this.namespace);
  }

  openScope(name: string) {
    this.writeLine(name + " {")
    this.indent++
  }

  openInlineScope(value: string) {
    this.endLine(value + " {")
    this.indent++
  }

  closeScope(suffix: string | null = null) {
    this.indent--;
    if (suffix != null) {
      this.writeLine("}" + suffix)
    } else {
      this.writeLine("}")
    }
  }

  openBrackets(name: string) {
    this.writeLine(name + " [")
    this.indent++
  }

  closeBrackets(suffix: string | null = null) {
    this.indent--;
    if (suffix != null) {
      this.writeLine("]" + suffix)
    } else {
      this.writeLine("]")
    }
  }

  public toString(): string {
    return this.builder.join("")
  }

  private indentString() {
    return ' '.repeat(this.indent * 2);
  }

  public renderFunctionCall(expressionFunction: FunctionCallExpression) {
    let functionCall = firstOrDefault(this.functionCalls, call => call.expressionFunction == expressionFunction);
    if (functionCall == null) throw new Error(`Function call not found: ${expressionFunction.nodeType}`);

    functionCall.renderExpression(this);
  }

  renderCustomBuiltInFunctions() {
    this.functionCalls.forEach(call => call.renderCustomFunction(this));
  }
}