import {BaseNode, NodeKind} from './node.js';
import { SocketScheme, Socket, SocketType} from '../others/socket.js';
import { Connection } from '../others/connection.js';

export abstract class changeingNode extends BaseNode {
    additionalSockets: Socket[] = []
    protected outputCount: number = 2;
    additonalSocketScheme: SocketScheme[];
    private outputsInput?: HTMLInputElement;

    constructor(socketScheme: SocketScheme[], additonalSocketScheme: SocketScheme[]) {
        super(socketScheme); 
        this.additonalSocketScheme = additonalSocketScheme;
    }

    protected renderCount() {
        const countInput = document.createElement("input");
        countInput.type = "number";
        countInput.className = "count";
        countInput.value = String(this.outputCount);
        countInput.min = "1";
        countInput.max = "8";
        
        this.newRow(countInput);
    }

    protected initOutputs(content: HTMLElement, initialCount: number = 2): void {
        this.outputCount = initialCount;
        
        this.outputsInput = content.querySelector('.count') as HTMLInputElement;
        if (this.outputsInput) {
            this.outputsInput.value = String(initialCount);
            this.outputsInput.onchange = () => {
                this.outputCount = parseInt(this.outputsInput!.value) || 1;
                this.syncSockets(this.outputCount);
            };
        }
    }

    public getOutputCount(): number {
        return this.outputCount;
    }

    protected deleteAllSockets(): void {   
        while (this.additionalSockets.length > 0) {
            const s = this.additionalSockets.pop();
            
            if (s?.socketType === SocketType.INPUT) {
                this.currentIN_Y -= BaseNode.gap;
            } else {
                this.currentOUT_Y -= BaseNode.gap;
            }

            s?.destroy();
        }
    }
    protected createAdditionalSockets(socketSchemes: SocketScheme[], prependSockets?: SocketScheme[]) {
        if (prependSockets) {
            this.createSockets(prependSockets, this.additionalSockets);
        }
        
        for (let i = 0; i < this.outputCount; i++) {
            this.createSockets(socketSchemes, this.additionalSockets);
        }
        
        this.heightUpdate();
    }

    protected syncSockets(count: number): void {
        this.outputCount = count;
        
        const socketsPerGroup = this.additonalSocketScheme.length;
        const desiredTotal = this.outputCount * socketsPerGroup;
        const currentTotal = this.additionalSockets.length;

        if (desiredTotal > currentTotal) {
            const missing = desiredTotal - currentTotal;
            const groupsToAdd = missing / socketsPerGroup;

            for (let i = 0; i < groupsToAdd; i++) {
                this.createSockets(this.additonalSocketScheme, this.additionalSockets);
            }
        } else {
            while (this.additionalSockets.length > desiredTotal) {
                const s = this.additionalSockets.pop();
                
                if (s?.socketType === SocketType.INPUT) {
                    this.currentIN_Y -= BaseNode.gap;
                } else {
                    this.currentOUT_Y -= BaseNode.gap;
                }
                
                s?.destroy();
            }
        }
        this.heightUpdate();
    }

    protected heightUpdate() {
        const maxSockets = Math.max(this.currentIN_Y, this.currentOUT_Y);
        const requiredHeight = maxSockets + BaseNode.gap;
        this.container.style.minHeight = `${requiredHeight}px`;
    }

    protected override updateSocketPosition(){
        this.sockets.forEach((socket: Socket) => {
            const pos = socket.getCanvasPosition();
            if(socket.socketType === SocketType.INPUT){
                socket.connectedTo.forEach((connection: Connection) => {
                    connection.updateLineEndpoint(pos.x, pos.y)
                });
            }
            else{
                socket.connectedTo.forEach((connection: Connection) => {
                    connection.updateLineBasepoint(pos.x, pos.y)
                });
            }
        });

        this.additionalSockets.forEach((socket: Socket) => {
            const pos = socket.getCanvasPosition();
            if(socket.socketType === SocketType.INPUT){
                socket.connectedTo.forEach((connection: Connection) => {
                    connection.updateLineEndpoint(pos.x, pos.y)
                });
            }
            else{
                socket.connectedTo.forEach((connection: Connection) => {
                    connection.updateLineBasepoint(pos.x, pos.y)
                });
            }
        });
    }

    public override getSockets() {
        return this.sockets.concat(this.additionalSockets);
    }
}