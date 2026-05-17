import {changeingNode } from './changeingNode.js';
import { SocketScheme, DataType, SocketType } from '../others/socket.js';
import { NodeKind, BaseNode } from './node.js';

let baseSocketArray: SocketScheme[] = [
    [DataType.ARRAY, SocketType.INPUT]
];

let addWriteSocketArray: SocketScheme[] = [
    [DataType.ADAPTING, SocketType.INPUT],
    [DataType.NUMBER, SocketType.INPUT]
];

let addReadSocketArray: SocketScheme[] = [
    [DataType.ADAPTING, SocketType.INPUT],
    [DataType.NUMBER, SocketType.OUTPUT]
];

type mode = 'WRITE' | 'READ';

export class ArrayNode extends changeingNode {
    protected get nodeKind() { return "ARRAY"; }
    private currentMode: mode = 'WRITE';

    constructor() {
        super(baseSocketArray, addWriteSocketArray);
        this.currentOUT_Y += BaseNode.gap;
        this.renderLayout();
        this.renderCount();
        this.initOutputs(this.content, 2);
        this.createAdditionalSockets(this.additonalSocketScheme);
    }

    private updateMode(mode: mode) {
        if (this.currentMode === mode) return;
        this.currentMode = mode;

        this.additonalSocketScheme = mode === 'READ' ? addReadSocketArray : addWriteSocketArray;
        this.deleteAllSockets();
        this.createAdditionalSockets(this.additonalSocketScheme);
    }

    private renderLayout() {
        const btnGroup = document.createElement("div");
        btnGroup.innerHTML = `
            <button class="button ${this.currentMode === 'READ' ? 'active' : ''}" id="btn-read-${this.ID}">READ</button>
            <span style="color: #444">|</span>
            <button class="button ${this.currentMode === 'WRITE' ? 'active' : ''}" id="btn-write-${this.ID}">WRITE</button>`;
        this.newRow(btnGroup);

        const btnRead = btnGroup.querySelector(`#btn-read-${this.ID}`) as HTMLElement;
        const btnWrite = btnGroup.querySelector(`#btn-write-${this.ID}`) as HTMLElement;

        btnRead.onclick = () => {
            this.updateMode('READ');
            btnRead.classList.add('active');
            btnWrite.classList.remove('active');
        };
        
        btnWrite.onclick = () => {
            this.updateMode('WRITE');
            btnWrite.classList.add('active');
            btnRead.classList.remove('active');
        };
    }
}