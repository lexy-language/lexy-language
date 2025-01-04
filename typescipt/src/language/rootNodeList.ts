import type {IRootNode} from "./rootNode";
import type {INode} from "./node";

import {TypeWithMembers} from "./variableTypes/typeWithMembers";
import {asFunction, Function, instanceOfFunction} from "./functions/function";
import {asTable, instanceOfTable, Table} from "./tables/table";
import {asEnumDefinition, EnumDefinition, instanceOfEnumDefinition} from "./enums/enumDefinition";
import {any, firstOrDefault, singleOrDefault, where, contains} from "../infrastructure/enumerableExtensions";
import {asTypeDefinition, instanceOfTypeDefinition, TypeDefinition} from "./types/typeDefinition";
import {asScenario, instanceOfScenario, Scenario} from "./scenarios/scenario";
import {TableType} from "./variableTypes/tableType";
import {FunctionType} from "./variableTypes/functionType";
import {EnumType} from "./variableTypes/enumType";
import {CustomType} from "./variableTypes/customType";

export class RootNodeList {

  private readonly values: Array<IRootNode> = [];

  public get length(): number {
    return this.values.length;
  }

  public asArray() {
    return [...this.values];
  }

   public add(rootNode: IRootNode): void {
     this.values.push(rootNode);
   }

   public containsEnum(enumName: string): boolean {
     return any(this.values, definition => instanceOfEnumDefinition(definition) && definition.nodeName == enumName);
   }

   public getNode(name: string | null): IRootNode | null {
     if (name == null) return null;
     return firstOrDefault(this.values, definition => definition.nodeName == name);
   }

   public contains(name: string): boolean {
     return any(this.values, definition => definition.nodeName == name);
   }

   public getFunction(name: string): Function | null {
     return asFunction(
       firstOrDefault(this.values, functionValue => instanceOfFunction(functionValue) && functionValue.nodeName == name));
   }

   public getTable(name: string): Table | null {
     return asTable(
       firstOrDefault(this.values, table => instanceOfTable(table) && table.nodeName == name));
   }

   public getCustomType(name: string): TypeDefinition | null {
     return asTypeDefinition(
       firstOrDefault(this.values, type => instanceOfTypeDefinition(type) && type.nodeName == name));
   }

   public getSingleFunction(): Function {
     const node = singleOrDefault(this.values);
     const functionValue = asFunction(node);
     return functionValue != null
       ? functionValue
       : throw new Error("Invalid type: " + node?.nodeType );
   }

   public getScenarios(): Array<Scenario> {
     return where(this.values, value => instanceOfScenario(value))
       .map(value => asScenario(value) as Scenario);
   }

   public getEnum(name: string): EnumDefinition | null {
     return asEnumDefinition(
       firstOrDefault(this.values,
           value => instanceOfEnumDefinition(value) && value?.nodeName == name));
   }

   public addIfNew(node: IRootNode): void {
     if (!contains(this.values, node)) this.values.push(node);
   }

   public first(): INode | null {
     return firstOrDefault(this.values);
   }

   public getType(name: string): TypeWithMembers | null {
     let node = this.getNode(name);

     let table = asTable(node);
     if (table != null) return new TableType(name, table);

     let functionValue = asFunction(node);
     if (functionValue != null) return new FunctionType(name, functionValue);

     let enumDefinition = asEnumDefinition(node);
     if (enumDefinition != null) return new EnumType(name, enumDefinition);

     let typeDefinition = asTypeDefinition(node);
     if (typeDefinition != null) return new CustomType(name, typeDefinition);

     return null;
   }
}
