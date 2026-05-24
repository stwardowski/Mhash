import { BitSize } from '../others/nodeFunctionalites.js';
import { changeingNode } from './changeingNode.js';
import { BaseNode, NodeKind } from './node.js';
import { SocketScheme, Socket, SocketType, DataType } from '../others/socket.js';

let baseSockets: SocketScheme[] = [
    [DataType.WHOLE, SocketType.OUTPUT]
];

let addSockets: SocketScheme[] = [
    [DataType.ADAPTING, SocketType.INPUT],
];

export class MergeNode extends changeingNode {
    protected get nodeKind() { return NodeKind.MERGE; }    

    constructor() {
        super(baseSockets, addSockets);
        this.renderCount();
        this.initOutputs(this.content, 2);
        this.createAdditionalSockets(this.additonalSocketScheme);
    }
}