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
    protected get nodeKind() { return NodeKind.SPLIT; }    
    private cycleButton: BitSize;
    
    constructor() {
        super(baseSockets, addSockets);
        this.renderCount();
        this.cycleButton = new BitSize("");
        this.newRow(this.cycleButton.getElement());
        this.initOutputs(this.content, 2);
        this.createAdditionalSockets(this.additonalSocketScheme);
    }

    public getType(){
        return this.cycleButton.getCurrent();
    }
}