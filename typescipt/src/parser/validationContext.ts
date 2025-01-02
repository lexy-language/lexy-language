import {IVariableContext, VariableContext} from "./variableContext";
import {Stack} from "../infrastructure/stack";
import {IParserLogger} from "./IParserLogger";
import {RootNodeList} from "../language/rootNodeList";
import {Expression} from "../language/expressions/expression";
import {VariableType} from "../language/types/variableType";
import {SourceReference} from "./sourceReference";

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

  variableContext: IVariableContext;
  createVariableScope() : { [Symbol.dispose] };

  validateType(expression: Expression, argumentIndex: number, name: string,
               type: VariableType, reference: SourceReference, functionHelp: string): IValidationContext;
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
       if (this.contexts.size() == 0) {
         return this.variableContextValue = null;
       }

       let variableContextValue = this.contexts.pop();
       return this.variableContextValue = !!variableContextValue ? variableContextValue : null;
     });
   }

  public validateType(expression: Expression, argumentIndex: number, name: string,
                      type: VariableType, reference: SourceReference, functionHelp: string): IValidationContext {

    let valueTypeEnd = expression.deriveType(this);
    if (valueTypeEnd == null || !valueTypeEnd.equals(type))
    this.logger.fail(reference, `Invalid argument ${argumentIndex}. '${name}' should be of type '${type}' but is '${valueTypeEnd}'. ${functionHelp}`);

    return this;
  }
}
