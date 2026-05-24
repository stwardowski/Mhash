import { BaseNode, NodeKind } from '../nodes/node.js';
import { ArrayNode } from '../nodes/arrayNode.js';
import { InputNode } from '../nodes/inputNode.js';
import { OutputNode } from '../nodes/outputNode.js';
import { VariableNode } from '../nodes/variableNode.js';
import { MathNode } from '../nodes/mathNode.js';
import { BitShiftNode } from '../nodes/bitShiftNode.js';
import { BitLogicNode } from '../nodes/bitLogicNode.js';
import { MergeNode } from '../nodes/mergeNode.js';
import { SplitNode } from '../nodes/splitNode.js';

export class NodeManager {
    private nodes: BaseNode[] = [];
    private currentNode: BaseNode | null = null;
    private creatingNodeType: NodeKind | null = null;
    private isPlacementMode = false;
    private canvas: HTMLElement;

    private static readonly NODE_FACTORY: Record<NodeKind, () => BaseNode> = {
        [NodeKind.INPUT]:    () => new InputNode(),
        [NodeKind.OUTPUT]:   () => new OutputNode(),
        [NodeKind.MATH]:     () => new MathNode(),
        [NodeKind.BITLOGIC]: () => new BitLogicNode(),
        [NodeKind.BITSHIFT]: () => new BitShiftNode(),
        [NodeKind.VARIABLE]: () => new VariableNode(),
        [NodeKind.ARRAY]:    () => new ArrayNode(),
        [NodeKind.SPLIT]:    () => new SplitNode(),
        [NodeKind.MERGE]:    () => new MergeNode(),
    };

    constructor(canvas: HTMLElement) {
        this.canvas = canvas;
    }

    public setPlacementMode(active: boolean, nodeType: NodeKind | null): void {
        this.isPlacementMode = active;
        this.creatingNodeType = nodeType;
    }

    public getNodes(){
        return this.nodes;
    }

    public createNodeAt(x: number, y: number): void {
        if (!this.isPlacementMode || this.creatingNodeType === null) return;
        
        const node = NodeManager.NODE_FACTORY[this.creatingNodeType]();
        node.getContainer().style.left = `${x}px`;
        node.getContainer().style.top = `${y}px`;
        
        this.canvas.appendChild(node.getContainer());
        this.nodes.push(node);
        
        this.setPlacementMode(false, null);
    }
}