import { CanvasController } from "./canvasNavigation.js";
import { Connections } from "./connection.js";

export enum SocketType {
    INPUT = "input",
    OUTPUT = "output"
}

export enum DataType {
    ARRAY,
    ADAPTING,
    NUMBER,
    WHOLE
}

export const TypeColors: Record<DataType, string> = {
    [DataType.ARRAY]: "#BC8F8F",
    [DataType.ADAPTING]: "#ffffff",
    [DataType.NUMBER]: "#f64636",
    [DataType.WHOLE]: "#00BFFF"
};

export type SocketScheme = [DataType, SocketType];

export class Socket {
    public socketDiv: HTMLDivElement;
    public circleDiv: HTMLDivElement;
    public id: number;
    public dataType: DataType;
    public socketType: SocketType;
    public connectedTo: Socket[] = [];
    private yPos: number;

    static SocketID = 0;
    private static socketRegistry: Map<HTMLDivElement, Socket> = new Map();
    
    constructor(datatype: DataType, socketType: SocketType, ypos: number) {
        this.id = Socket.SocketID++;
        this.socketType = socketType;
        this.dataType = datatype;
        this.yPos = ypos;

        this.socketDiv = this.createDiv();
        this.circleDiv = this.createCircle();
        this.socketDiv.appendChild(this.circleDiv);
        
        Socket.socketRegistry.set(this.socketDiv, this);
        this.addListeners();
    }

    private createDiv(): HTMLDivElement {
        const socketDiv = document.createElement("div");
        socketDiv.style.cssText = `
            width: 25px;
            height: 25px;
            position: absolute;
            left: ${this.socketType === SocketType.INPUT ? "-10px" : "170px"};
            top: ${this.yPos}px;
            pointer-events: auto;
            cursor: pointer;
        `;
        return socketDiv;
    }

    private createCircle(): HTMLDivElement {
        const circle = document.createElement("div");
        circle.style.cssText = `
            width: 12px;
            height: 12px;
            background: ${TypeColors[this.dataType] || "#888"};
            border: 1px solid #333;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        `;
        return circle;
    }


    public destroy(): void {
        Socket.socketRegistry.delete(this.socketDiv);
        this.disconnectAll();
        this.socketDiv.remove();
    }

    public getCanvasPosition(): { x: number; y: number } {
        const rect = this.socketDiv.getBoundingClientRect();
        const position = CanvasController.screenToCanvas(rect.x, rect.y);
        position.x += rect.width / 2;
        position.y += rect.height / 2;
        return position;
    }


    private highlight(active: boolean): void {
        this.circleDiv.style.background = active ? "#0f0" : TypeColors[this.dataType];
    }

    // private canConnectTo(target: Socket): boolean {
    //     if (target === this) return false;
    //     if (this.socketType === target.socketType) return false;
    //     if (this.socketType === SocketType.INPUT) return false;
    //     if (this.connectedTo.includes(target)) return false;
        
    //     if (this.dataType !== target.dataType && 
    //         this.dataType !== DataType.ADAPTING && 
    //         target.dataType !== DataType.ADAPTING) {
    //         return false;
    //     }
        
    //     return true;
    // }

    private addListeners(): void {
        this.socketDiv.addEventListener('mousedown', (e: MouseEvent) => {
            e.stopPropagation();
            if (this.socketType === SocketType.OUTPUT) {
                this.startConnection(e);
            }
        });
    }

    private startConnection(e: MouseEvent): void {
        const connections = Connections.getInstance();
        const pos = this.getCanvasPosition();
        const mousePos = CanvasController.screenToCanvas(e.clientX, e.clientY);
        
        connections.createTempLine(pos.x, pos.y, mousePos.x, mousePos.y);
        
        const onMove = (e: MouseEvent) => {
            const currentMousePos = CanvasController.screenToCanvas(e.clientX, e.clientY);
            connections.updateTempLine(currentMousePos.x, currentMousePos.y);
        };
        
        const onUp = (e: MouseEvent) => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            this.endConnection(e);
        };
        
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }

    private endConnection(e: MouseEvent): void {
        const connections = Connections.getInstance();
        
        const target = e.target as HTMLElement;
        const socketElement = target.closest('.socket') as HTMLDivElement;
        
        if (socketElement) {
            const targetSocket = Socket.socketRegistry.get(socketElement)
            if (targetSocket) {
                this.connect(targetSocket);
            }
        }
        
        connections.removeTempLine();
    }

    public connect(target: Socket): void {
        // if (!this.canConnectTo(target)) return;
        
        this.connectedTo.push(target);
        target.connectedTo.push(this);
        
        this.highlight(true);
        target.highlight(true);
        
        const pos1 = this.getCanvasPosition();
        const pos2 = target.getCanvasPosition();
        const connectionId = `${this.id}-${target.id}`;
        
        Connections.getInstance().createConnection(pos1.x, pos1.y, pos2.x, pos2.y, connectionId);
    }

    public disconnect(target: Socket): void {
        const connectionId1 = `${this.id}-${target.id}`;
        const connectionId2 = `${target.id}-${this.id}`;
        
        Connections.getInstance().removeConnection(connectionId1);
        Connections.getInstance().removeConnection(connectionId2);
        
        this.connectedTo = this.connectedTo.filter(s => s !== target);
        target.connectedTo = target.connectedTo.filter(s => s !== this);
        
        this.highlight(false);
        target.highlight(false);
    }

    private disconnectAll(): void {
        [...this.connectedTo].forEach(socket => this.disconnect(socket));
    }
}