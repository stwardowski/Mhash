import { BitSize, Dropdown } from '../others/nodeFunctionalites.js';
import {BaseNode, NodeKind} from './node.js'
import {Socket, SocketType, SocketScheme, DataType} from '../others/socket.js'
import { inputFormater } from '../others/inputFormat.js';
import { InFormat } from '../others/formater.js';

let baseSockets: SocketScheme[] = [
    [DataType.NUMBER, SocketType.INPUT],
    [DataType.NUMBER, SocketType.OUTPUT]
];

export class VariableNode extends BaseNode {
    protected get nodeKind() { return "VARIABLE"; }    

    static variableID = 0;

    private cycleButton: BitSize;
    private choose: Dropdown
    private input;
    private format: inputFormater;

    private readonly droplist: string[] = ['DEC', 'BIN'];
    
    constructor() {
        super(baseSockets);
        VariableNode.variableID++;

        this.choose = new Dropdown(this.droplist)
        this.newRow(this.choose.getElement())
        
        this.cycleButton = new BitSize("");
        this.newRow(this.cycleButton.getElement())
        
        this.input = this.createInput()
        this.input.className = "input"
        this.newRow(this.input)
        
        this.renderLayout();
        this.format = new inputFormater(this.droplist[0] as InFormat, this.choose.getElement(), this.input);
    }

    private createInput(): HTMLTextAreaElement {
        const input = document.createElement("textarea");
        input.rows = 3;
        return input
    }

    private renderLayout() {
        this.content = document.createElement("div");
        this.content.innerHTML = `
                <span style="font-size: 12px; color: #aaa">${VariableNode.variableID}</span>
                <span style="font-size: 12px; color: #aaa">ID</span>`;
        this.container.appendChild(this.content);
    }
}