

export class ParserLogger extends IParserLogger {
   private readonly Array<LogEntry> logEntries = list<LogEntry>(): new;

   private readonly ILogger<ParserLogger> logger;
   private IRootNode currentNode;
   private number failedMessages;

   constructor(logger: ILogger<ParserLogger>) {
     this.logger = logger ?? throw new Error(nameof(logger));
   }

   public hasErrors(): boolean {
     return failedMessages > 0;
   }

   public hasRootErrors(): boolean {
     return logEntries.Any(entry => entry.IsError && entry.Node == null);
   }

   public logInfo(message: string): void {
     logger.LogInformation(message);
   }

   public log(reference: SourceReference, message: string): void {
     if (reference == null) throw new Error(nameof(reference));
     if (message == null) throw new Error(nameof(message));

     logger.LogDebug(`{reference}: {Message}`, reference, message);
     logEntries.Add(new LogEntry(currentNode, false, $`{reference}: {message}`));
   }

   public fail(reference: SourceReference, message: string): void {
     if (reference == null) throw new Error(nameof(reference));
     if (message == null) throw new Error(nameof(message));

     failedMessages++;

     logger.LogError(`{reference}: ERROR - {Message}`, reference, message);
     logEntries.Add(new LogEntry(currentNode, true, $`{reference}: ERROR - {message}`));
   }

   public fail(node: INode, reference: SourceReference, message: string): void {
     if (reference == null) throw new Error(nameof(reference));
     if (message == null) throw new Error(nameof(message));

     failedMessages++;

     logger.LogError(`{reference}: ERROR - {Message}`, reference, message);
     logEntries.Add(new LogEntry(node, true, $`{reference}: ERROR - {message}`));
   }

   public logNodes(nodes: Array<INode>): void {
     if (!logger.IsEnabled(LogLevel.Debug)) return;

     let nodeLogger = new NodesLogger();
     nodeLogger.Log(nodes);

     logger.LogDebug(`Parsed nodes: {Nodes}`, nodeLogger.toString());
   }

   public hasErrorMessage(expectedError: string): boolean {
     return logEntries.Any(message => message.IsError && message.Message.contains(expectedError));
   }

   public formatMessages(): string {
     return
       $`{string.Join(Environment.NewLine, logEntries)}{Environment.NewLine}`;
   }

   public setCurrentNode(node: IRootNode): void {
     currentNode = node ?? throw new Error(nameof(node));
   }

   public reset(): void {
     currentNode = null;
   }

   public nodeHasErrors(node: IRootNode): boolean {
     if (node == null) throw new Error(nameof(node));

     return logEntries.Any(message => message.IsError && message.Node == node);
   }

   public string[errorNodeMessages(node: IRootNode): ] {
     return logEntries.Where(entry => entry.IsError && entry.Node == node)
       .Select(entry => entry.Message)
       .ToArray();
   }

   public string[errorRootMessages(): ] {
     return logEntries.Where(entry => entry.IsError && entry.Node == null)
       .Select(entry => entry.Message)
       .ToArray();
   }

   public string[errorMessages(): ] {
     return logEntries.Where(entry => entry.IsError)
       .Select(entry => entry.Message)
       .ToArray();
   }

   public assertNoErrors(): void {
     if (HasErrors()) throw new Error($`Parsing failed: {FormatMessages()}`);
   }

   private class LogEntry {
     public INode Node
     public boolean IsError
     public string Message

     logEntry(node: INode, isError: boolean, message: string): public {
       Node = node;
       IsError = isError;
       Message = message;
     }

     public override toString(): string {
       return Message;
     }
   }
}
