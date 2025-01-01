import {IValidationContext} from "./ValidationContext";
import {VariableType} from "../language/types/variableType";
import {SourceReference} from "./sourceReference";
import {IParserLogger} from "./IParserLogger";
import {VariableEntry} from "./variableEntry";
import {VariableReference} from "../runTime/variableReference";
import {VariableSource} from "./variableSource";
import {ITypeWithMembers} from "../language/types/iTypeWithMembers";

export interface IVariableContext {
  addVariable(variableName: string, type: VariableType, source: VariableSource): void;

  registerVariableAndVerifyUnique(reference: SourceReference, variableName: string, type: VariableType | null,
                                  source: VariableSource): void;

  ensureVariableExists(reference: SourceReference, variableName: string): boolean;

  contains(variableName: string): boolean;
  contains(reference: VariableReference, context: IValidationContext): boolean;

  getVariableTypeByName(variableName: string): VariableType | null;
  getVariableType(reference: VariableReference, context: IValidationContext): VariableType | null;
  getVariableSource(variableName: string): VariableSource | null;

  getVariable(variableName: string): VariableEntry | null;
}

export class VariableContext implements IVariableContext {
   private readonly logger: IParserLogger;
   private readonly parentContext: IVariableContext | null;
   private readonly variables: { [id: string] : VariableEntry; } = {};

   constructor(logger: IParserLogger, parentContext: IVariableContext | null) {
     this.logger = logger;
     this.parentContext = parentContext;
   }

   public addVariable(name: string, type: VariableType, source: VariableSource): void {
     if (this.contains(name)) return;

     let entry = new VariableEntry(type, source);
     this.variables[name] = entry;
   }

   public registerVariableAndVerifyUnique(reference: SourceReference, name: string, type: VariableType | null,
                                               source: VariableSource): void {
     if (this.contains(name)) {
       this.logger.fail(reference, `Duplicated variable name: '${name}'`);
       return;
     }

     let entry = new VariableEntry(type, source);
     this.variables[name] = entry;
   }

   public contains(name: string): boolean {
     return name in this.variables || this.parentContext != null && this.parentContext.contains(name);
   }

   public contains(reference: VariableReference, context: IValidationContext): boolean {
     let parent = this.getVariable(reference.ParentIdentifier);
     if (parent == null) return false;

     return !reference.HasChildIdentifiers ||
        this.containChild(parent.variableType, reference.childrenReference(), context);
   }

   public ensureVariableExists(reference: SourceReference, name: string): boolean {
     if (!this.contains(name)) {
       this.logger.fail(reference, `Unknown variable name: '${name}'.`);
       return false;
     }

     return true;
   }

   public getVariableTypeByName(name: string): VariableType | null {
     return name in this.variables
       ? this.variables[name].variableType
       : this.parentContext !== null
          ? this.parentContext.getVariableTypeByName(name)
          : null;
   }

   public getVariableType(reference: VariableReference, context: IValidationContext): VariableType | null {
     let parent = this.getVariableTypeByName(reference.ParentIdentifier);
     return parent == null || !reference.HasChildIdentifiers
       ? parent
       : this.getVariableType(parent, reference.childrenReference(), context);
   }

   public getVariableSource(name: string): VariableSource | null {
     return name in this.variables
       ? this.variables[name].variableSource
       : this.parentContext != null
         ? this.parentContext.getVariableSource(name)
         : null;
   }

   public getVariable(name: string): VariableEntry | null {
     return name in this.variables
       ? this.variables[name]
       : null;
   }

   private containChild(parentType: VariableType | null, reference: VariableReference, context: IValidationContext): boolean {
     let typeWithMembers = 'memberType' in parentType ? parentType as ITypeWithMembers : null;

     let memberVariableType = typeWithMembers != null ? typeWithMembers.memberType(reference.ParentIdentifier, context) : null;
     if (memberVariableType == null) return false;

     return !reference.HasChildIdentifiers
        || this.containChild(memberVariableType, reference.childrenReference(), context);
   }

   private getVariableType(parentType: VariableType, reference: VariableReference,
                            context: IValidationContext ): VariableType | null {

     let typeWithMembers = 'memberType' in parentType ? parentType as ITypeWithMembers : null;
     if (typeWithMembers == null) return null;

     let memberVariableType = typeWithMembers.memberType(reference.ParentIdentifier, context);
     if (memberVariableType == null) return null;

     return !reference.HasChildIdentifiers
       ? memberVariableType
       : this.getVariableType(memberVariableType, reference.childrenReference(), context);
   }
}
