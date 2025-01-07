import type {IParserLogger} from "./ParserLogger";
import type {ITypeWithMembers} from "../language/variableTypes/ITypeWithMembers";
import type {IValidationContext} from "./ValidationContext";

import {VariableType} from "../language/variableTypes/variableType";
import {SourceReference} from "./sourceReference";
import {VariableEntry} from "./variableEntry";
import {VariableReference} from "../language/variableReference";
import {VariableSource} from "../language/variableSource";
import {asTypeWithMembers} from "../language/variableTypes/ITypeWithMembers";

export interface IVariableContext {
  addVariable(variableName: string, type: VariableType, source: VariableSource): void;

  registerVariableAndVerifyUnique(reference: SourceReference, variableName: string, type: VariableType | null,
                                  source: VariableSource): void;

  ensureVariableExists(reference: SourceReference, variableName: string): boolean;

  containsName(variableName: string): boolean;
  containsReference(reference: VariableReference, context: IValidationContext): boolean;

  getVariableTypeByName(variableName: string): VariableType | null;
  getVariableTypeByReference(reference: VariableReference, context: IValidationContext): VariableType | null;
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
     if (this.containsName(name)) return;

     let entry = new VariableEntry(type, source);
     this.variables[name] = entry;
   }

   public registerVariableAndVerifyUnique(reference: SourceReference, name: string, type: VariableType | null,
                                               source: VariableSource): void {
     if (this.containsName(name)) {
       this.logger.fail(reference, `Duplicated variable name: '${name}'`);
       return;
     }

     let entry = new VariableEntry(type, source);
     this.variables[name] = entry;
   }

   public containsName(name: string): boolean {
     return name in this.variables || (this.parentContext != null && this.parentContext.contains(name));
   }

   public containsReference(reference: VariableReference, context: IValidationContext): boolean {
     let parent = this.getVariable(reference.parentIdentifier);
     if (parent == null) return false;

     return !reference.hasChildIdentifiers ||
        this.containChild(parent.variableType, reference.childrenReference(), context);
   }

   public ensureVariableExists(reference: SourceReference, name: string): boolean {
     if (!this.containsName(name)) {
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

   public getVariableTypeByReference(reference: VariableReference, context: IValidationContext): VariableType | null {
     let parent = this.getVariableTypeByName(reference.parentIdentifier);
     return parent == null || !reference.hasChildIdentifiers
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
     let typeWithMembers = (parentType as any).typeWithMember == true ? parentType as ITypeWithMembers : null;

     let memberVariableType = typeWithMembers != null ? typeWithMembers.memberType(reference.parentIdentifier, context) : null;
     if (memberVariableType == null) return false;

     return !reference.hasChildIdentifiers
        || this.containChild(memberVariableType, reference.childrenReference(), context);
   }

   private getVariableType(parentType: VariableType, reference: VariableReference,
                            context: IValidationContext ): VariableType | null {

     let typeWithMembers = asTypeWithMembers(parentType);
     if (typeWithMembers == null) return null;

     let memberVariableType = typeWithMembers.memberType(reference.parentIdentifier, context);
     if (memberVariableType == null) return null;

     return !reference.hasChildIdentifiers
       ? memberVariableType
       : this.getVariableType(memberVariableType, reference.childrenReference(), context);
   }
}
