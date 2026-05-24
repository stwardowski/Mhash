import { Dropdown } from '../others/nodeFunctionalites.js';
import { BaseNode, NodeKind } from './node.js';
import { SocketScheme, Socket, SocketType, DataType } from '../others/socket.js';

let baseSockets: SocketScheme[] = [
    [DataType.WHOLE, SocketType.INPUT]
];

export class OutputNode extends BaseNode {
    protected get nodeKind() { return NodeKind.OUTPUT; }    

    private readonly format: string[] = ['BIN', 'TEXT', 'HEX'];
    private dropdown: Dropdown;
    private output: HTMLInputElement;

    public getFormat(){
        return this.dropdown.getCurrent();
    }

    constructor() {
        super(baseSockets);

        this.dropdown = new Dropdown(this.format);
        this.output = this.createOutput();
        this.newRow(this.dropdown.getElement())
        this.newRow(this.output)
    }

    private createOutput(): HTMLInputElement {
        const input = document.createElement("input");
        input.id = "hash";
        input.className = "input";
        input.readOnly = true;
        return input;
    }
}