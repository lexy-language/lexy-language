import {IVariableContext, VariableContext} from "./variableContext";
import {Stack} from "../infrastructure/lambdaComparer";
import {IParserLogger} from "./IParserLogger";
import {RootNodeList} from "../language/rootNodeList";

class CodeContextScope  {
  private readonly func: () => IVariableContext | null;

  constructor(func: (() => IVariableContext | null)) {
    this.func = func;
  }

  [Symbol.dispose] = () => {
    this.func();
  }
}

export interface IValidationContext {
  logger: IParserLogger;
  rootNodes: RootNodeList;

  variableContext: IVariableContext | null;
  createVariableScope() : { [Symbol.dispose] };
}

export class ValidationContext implements IValidationContext {
   private contexts: Stack<IVariableContext> = new Stack<IVariableContext>()
   private variableContextValue: IVariableContext | null;

   public logger: IParserLogger;
   public rootNodes: RootNodeList;

   constructor(logger: IParserLogger, rootNodes: RootNodeList) {
     this.logger = logger;
     this.rootNodes = rootNodes;
   }

   public get variableContext(): IVariableContext {
     if (this.variableContextValue == null) throw new Error(`FunctionCodeContext not set.`);
     return this.variableContextValue;
   }

   public createVariableScope(): { [Symbol.dispose] } {
     if (this.variableContextValue != null) {
       this.contexts.push(this.variableContextValue);
     }

     this.variableContextValue = new VariableContext(this.logger, this.variableContextValue);

     return new CodeContextScope(() => {
       return this.variableContextValue = this.contexts.size() == 0 ? null : this.contexts.pop();
     });
   }
}
