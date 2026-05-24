import {BaseNode, NodeKind} from './node.js';
import { SocketScheme, Socket, SocketType, DataType} from '../others/socket.js';
import { BitSize, Dropdown } from '../others/nodeFunctionalites.js'

let baseSockets: SocketScheme[] = [
    [DataType.ADAPTING, SocketType.INPUT],
    [DataType.ADAPTING, SocketType.INPUT],
    [DataType.NUMBER, SocketType.OUTPUT]
];

export class MathNode extends BaseNode {
    protected get nodeKind() { return NodeKind.MATH; }    
    
    private readonly droplist: string[] = ['ADD', 'MUL', 'SUB'];
    private dropdown: Dropdown;
    private cycleButton: BitSize;

    constructor() {
        super(baseSockets);
        this.dropdown = new Dropdown(this.droplist);
        this.newRow(this.dropdown.getElement())
        this.cycleButton = new BitSize("")
        this.newRow(this.cycleButton.getElement())
    }

    public getOperation(){
        return this.dropdown.getCurrent();
    }
    public getType(){
        return this.cycleButton.getCurrent();
    }

}