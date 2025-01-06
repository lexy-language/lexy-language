import {TypeWithMembers} from "./typeWithMembers";
import {VariableType} from "./variableType";
import {Function} from "../functions/function";
import {IValidationContext} from "../../parser/validationContext";
import {FunctionParametersType} from "./functionParametersType";
import {FunctionResultsType} from "./functionResultsType";
import {VariableTypeName} from "./variableTypeName";

export class FunctionType extends TypeWithMembers {

  public readonly variableTypeName = VariableTypeName.FunctionType;

  public type: string;
   public functionValue: Function;

   constructor(type: string, functionValue: Function) {
     super();
     this.type = type;
     this.functionValue = functionValue;
   }

   protected equals(other: FunctionType): boolean {
     return this.type == other?.type;
   }

   public toString(): string {
     return this.type;
   }

   public override memberType(name: string, context: IValidationContext): VariableType | null {
     if (name == Function.parameterName) return this.functionParametersType(context);
     if (name == Function.resultsName) return this.functionResultsType(context);
     return null;
   }

   private functionParametersType(context: IValidationContext): FunctionParametersType | null {
     let complexType = context.rootNodes.getFunction(this.type)?.getParametersType(context);
     return complexType ? new FunctionParametersType(this.type, complexType) : null;
   }

   private functionResultsType(context: IValidationContext): FunctionResultsType | null {
     let complexType = context.rootNodes.getFunction(this.type)?.getResultsType(context);
     return complexType ? new FunctionResultsType(this.type, complexType) : null;
   }
}
