import { BitSize } from '../others/nodeFunctionalites.js';
import { changeingNode } from './changeingNode.js';
import {BaseNode, NodeKind} from './node.js';
import { SocketScheme, Socket, SocketType, DataType} from '../others/socket.js'

let baseSockets: SocketScheme[] = [
    [DataType.WHOLE, SocketType.INPUT],
    [DataType.ARRAY, SocketType.OUTPUT],
];

let addSockets: SocketScheme[] = [
    [DataType.ADAPTING, SocketType.INPUT],
    [DataType.NUMBER, SocketType.OUTPUT]
];

export class SplitNode extends changeingNode {
    protected get nodeKind() { return "SPLIT"; }    
    private bitSize: BitSize;
    
    constructor() {
        super(baseSockets, addSockets);
        this.renderCount();
        this.bitSize = new BitSize("");
        this.newRow(this.bitSize.getElement());
        this.initOutputs(this.content, 2);
        this.createAdditionalSockets(this.additonalSocketScheme);
    }
}