import { BaseNode, NodeKind } from './node.js';
import { inputFormater } from '../others/inputFormat.js';
import { Socket, SocketType, DataType, SocketScheme } from '../others/socket.js';
import { Dropdown } from '../others/nodeFunctionalites.js';

let baseSockets: SocketScheme[] = [
    [DataType.WHOLE, SocketType.OUTPUT]
];

export class InputNode extends BaseNode {
    protected get nodeKind() { return NodeKind.INPUT; }

    private inputFormater: inputFormater;
    private readonly droplist: string[] = ['BIN', 'HEX', 'TEXT'];
    private format: Dropdown;
    private input;

    constructor() {
        super(baseSockets);
        this.format = new Dropdown(this.droplist);
        this.newRow(this.format.getElement()); 

        this.input = this.createInput();
        this.inputFormater = new inputFormater('BIN', this.format.getElement(), this.input);
    }

    private createInput(): HTMLTextAreaElement {
        const input = document.createElement("textarea");
        input.id = "message";
        input.rows = 3;
        input.className = "input";
        this.newRow(input);
        return input;
    }
    public getFormat(){
        return this.format.getCurrent();
    }
    public getInput(){
        return this.input.textContent;
    }

}