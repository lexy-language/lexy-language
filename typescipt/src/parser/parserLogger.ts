import type {IRootNode} from "../language/rootNode";
import type {INode} from "../language/node";
import type {ILogger} from "../infrastructure/logger";

import {SourceReference} from "./sourceReference";
import {any, where} from "../infrastructure/enumerableExtensions";
import {LogLevel} from "../infrastructure/logger";
import {format} from "../infrastructure/formatting";
import {NodesLogger} from "./nodesLogger";

class LogEntry {
  public node: INode | null;
  public isError: boolean;
  public message: string;

  constructor(node: INode | null, isError: boolean, message: string) {
    this.node = node;
    this.isError = isError;
    this.message = message;
  }

  public toString(): string {
    return this.message;
  }
}

export interface IParserLogger {

  logInfo(message: string): void;
  log(reference: SourceReference, message: string): void;
  fail(reference: SourceReference, message: string): void;

  logNodes(nodes: Array<INode>);

  hasErrors(): boolean;
  hasRootErrors(): boolean;
  hasErrorMessage(expectedError: string): boolean;

  formatMessages(): string;

  nodeHasErrors(node: IRootNode ): boolean;

  errorMessages(): string[];
  errorRootMessages(): string[];
  errorNodeMessages(node: IRootNode): string[];

  assertNoErrors(): void;

  setCurrentNode(node: IRootNode): void;
  resetCurrentNode(): void;
}

export class ParserLogger implements IParserLogger {

   private readonly logEntries: Array<LogEntry> = [];

   private readonly logger: ILogger;
   private currentNode: IRootNode | null;
   private failedMessages: number = 0;

   constructor(logger: ILogger) {
     this.logger = logger;
   }

   public hasErrors(): boolean {
     return this.failedMessages > 0;
   }

   public hasRootErrors(): boolean {
     return any(this.logEntries, entry => entry.isError && entry.node == null);
   }

   public logInfo(message: string): void {
     this.logger.logInformation(message);
   }

   public log(reference: SourceReference, message: string): void {
     this.logger.logDebug(`${reference}: ${message}`);
     this.logEntries.push(new LogEntry(this.currentNode, false, `${reference}: ${message}`));
   }

   public fail(reference: SourceReference, message: string): void {

     this.failedMessages++;

     this.logger.logError(`${reference}: ERROR - ${message}`);
     this.logEntries.push(new LogEntry(this.currentNode, true, `${reference}: ERROR - ${message}`));
   }

   public logNodes(nodes: Array<INode>): void {
     if (!this.logger.isEnabled(LogLevel.Debug)) return;

     let nodeLogger = new NodesLogger();
     nodeLogger.log(nodes);

     this.logger.logDebug(`Parsed nodes: ${nodeLogger.toString()}`);
   }

   public hasErrorMessage(expectedError: string): boolean {
     return any(this.logEntries, message => message.isError && message.message.includes(expectedError));
   }

   public formatMessages(): string {
     return `${format(this.logEntries, 0)}\n`;
   }

   public setCurrentNode(node: IRootNode): void {
     this.currentNode = node;
   }

   public resetCurrentNode(): void {
     this.currentNode = null;
   }

   public nodeHasErrors(node: IRootNode): boolean {
     return any(this.logEntries, message => message.isError && message.node === node);
   }

   public errorNodeMessages(node: IRootNode): string[] {
     return where(this.logEntries, entry => entry.isError && entry.node === node)
       .map(entry => entry.message);
   }

   public errorRootMessages(): string[] {
     return where(this.logEntries, entry => entry.isError && entry.node === null)
       .map(entry => entry.message);
   }

   public errorMessages(): string[] {
     return where(this.logEntries, entry => entry.isError)
       .map(entry => entry.message);
   }

   public assertNoErrors(): void {
     if (this.hasErrors()) throw new Error(`Parsing failed: ${this.formatMessages()}`);
   }
}
