import { Dropdown } from '../others/nodeFunctionalites.js';
import {BaseNode, NodeKind} from './node.js';
import { SocketScheme, Socket, SocketType, DataType} from '../others/socket.js';

let baseSockets: SocketScheme[] = [
    [DataType.ADAPTING, SocketType.INPUT],
    [DataType.ADAPTING, SocketType.INPUT],
    [DataType.ADAPTING, SocketType.OUTPUT]
];

export class BitLogicNode extends BaseNode {
    protected get nodeKind() { return "BITLOGIC"; }

    private readonly bitOperationList: string[] = ['AND', 'OR', 'XOR', 'NOT'];
    private readonly directionList: string[] = ['RIGHT', 'LEFT'];

    private type: Dropdown;
    private way: Dropdown;

    constructor() {
        super(baseSockets);
        this.type = new Dropdown(this.bitOperationList)
        this.way = new Dropdown(this.directionList)
        this.newRow(this.type.getElement());
        this.newRow(this.way.getElement());
    }

}
