import { BaseNode, NodeKind } from './node.js';
import { SocketScheme, Socket, SocketType, DataType } from '../others/socket.js';
import { Dropdown } from '../others/nodeFunctionalites.js';
let baseSockets: SocketScheme[] = [
    [DataType.ADAPTING, SocketType.INPUT],
    [DataType.ADAPTING, SocketType.OUTPUT]
];

export class BitShiftNode extends BaseNode {

    private readonly wayDroplist: string[] = ['RIGHT', 'LEFT'];
    private readonly typeDroplist: string[] = ['SHIFT', 'CIRCULAR'];
     
    protected get nodeKind() { return "BITSHIFT"; }

    private type: Dropdown;
    private way: Dropdown;

    constructor() {
        super(baseSockets);  
        this.type = new Dropdown(this.typeDroplist);
        this.way = new Dropdown(this.wayDroplist);
        this.newRow(this.type.getElement());
        this.newRow(this.way.getElement())
    }
}