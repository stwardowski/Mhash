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
    protected get nodeKind() { return NodeKind.VARIABLE; }    

    static variableID = 0;

    private cycleButton: BitSize;
    private format: Dropdown
    private input;
    private inputFormater: inputFormater;

    private readonly droplist: string[] = ['DEC', 'BIN'];
    
    constructor() {
        super(baseSockets);
        VariableNode.variableID++;

        this.format = new Dropdown(this.droplist)
        this.newRow(this.format.getElement())
        
        this.cycleButton = new BitSize("");
        this.newRow(this.cycleButton.getElement())
        
        this.input = this.createInput()
        this.input.className = "input"
        this.newRow(this.input)
        
        this.renderLayout();
        this.inputFormater = new inputFormater(this.droplist[0] as InFormat, this.format.getElement(), this.input);
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

    public getFormat(){
        return this.format.getCurrent();
    }  
    public getInput(){
        return this.input.textContent;
    }
    public getType(){
        return this.cycleButton.getCurrent();
    }
}