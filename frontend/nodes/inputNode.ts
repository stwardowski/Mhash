import { BaseNode, NodeKind } from './node.js';
import { inputFormater } from '../others/inputFormat.js';
import { Socket, SocketType, DataType, SocketScheme } from '../others/socket.js';
import { Dropdown } from '../others/nodeFunctionalites.js';

let baseSockets: SocketScheme[] = [
    [DataType.WHOLE, SocketType.OUTPUT]
];

export class InputNode extends BaseNode {
    protected get nodeKind() { return "INPUT"; }

    private format: inputFormater;
    private readonly droplist: string[] = ['BIN', 'HEX', 'TEXT'];
    private dropdown: Dropdown;

    constructor() {
        super(baseSockets);
        this.dropdown = new Dropdown(this.droplist);
        this.newRow(this.dropdown.getElement()); 

        const input = this.createInput();
        this.format = new inputFormater('BIN', this.dropdown.getElement(), input);
    }

    private createInput(): HTMLTextAreaElement {
        const input = document.createElement("textarea");
        input.id = "message";
        input.rows = 3;
        input.className = "input";
        this.newRow(input);
        return input;
    }
}