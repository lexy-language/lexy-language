import type {IRootNode} from "../language/rootNode";
import type {INode} from "../language/node";

import {RootNodeList} from "../language/rootNodeList";
import {DependencyNode} from "./dependencyNode";
import {asRootNode} from "../language/rootNode";
import {asHasNodeDependencies} from "../language/IHasNodeDependencies";
import {any} from "../infrastructure/enumerableExtensions";
import {NodesWalker} from "../language/nodesWalker";

export class Dependencies {
   private readonly circularReferencesValue: Array<IRootNode> = [];
   private readonly rootNodes: RootNodeList;

   public nodes: Array<DependencyNode> = [];

   public get hasCircularReferences() {
     return this.circularReferences.length > 0
   }

   public get circularReferences() {
     return [...this.circularReferencesValue];
   }

   constructor(rootNodes: RootNodeList) {
     this.rootNodes = rootNodes;
   }

   public build(): void {
     this.processNodes(this.rootNodes.asArray(), null);
   }

   private processNodes(nodes: Array<IRootNode>, parentNode: DependencyNode | null): void {
     for (const node of nodes) {
       this.nodes.push(this.processNode(node, parentNode));
     }
   }

   private processNode(node: INode, parentNode: DependencyNode | null): DependencyNode {
     let dependencyNode = this.newDependencyNode(node, parentNode);
     let dependencies = this.getDependencies(node, dependencyNode);
     for (const dependency of dependencies) {
       dependencyNode.addDependency(dependency)
     }
     return dependencyNode;
   }

   private newDependencyNode(node: INode, parentNode: DependencyNode | null): DependencyNode {
     const rootNode = asRootNode(node);
     const name = rootNode != null && rootNode.nodeName != null ? rootNode.nodeName : node.nodeType;
     return new DependencyNode(name, node.nodeType, parentNode);
   }

   private getDependencies(node: INode, parentNode: DependencyNode): ReadonlyArray<DependencyNode> {
     let resultDependencies = new Array<DependencyNode>();
     NodesWalker.walk(node, childNode => this.processDependencies(parentNode, childNode, resultDependencies));
     return resultDependencies;
   }

   private processDependencies(parentNode: DependencyNode, childNode: INode, resultDependencies: Array<DependencyNode>) {
     let nodeDependencies = asHasNodeDependencies(childNode)?.getDependencies(this.rootNodes);
     if (nodeDependencies == null) return;

     for (const dependency of nodeDependencies) {
       this.validateDependency(parentNode, resultDependencies, dependency);
     }
   }

   private validateDependency(parentNode: DependencyNode, resultDependencies: Array<DependencyNode>, dependency: IRootNode): void {
     if (dependency == null) throw new Error(`node.GetNodes() should never return null`);

     if (parentNode != null && parentNode.existsInLineage(dependency.nodeName, dependency.nodeType)) {
       this.circularReferencesValue.push(dependency);
     }
     else {
       if (this.dependencyExists(resultDependencies, dependency)) return;

       let dependencyNode = this.processNode(dependency, parentNode);
       resultDependencies.push (dependencyNode);
     }
   }

   private dependencyExists(resultDependencies: Array<DependencyNode>, dependency: IRootNode): boolean {
     return any(resultDependencies, any => any.name == dependency.nodeName && any.type == dependency.nodeType);
   }
}
