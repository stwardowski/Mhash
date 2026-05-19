import { CanvasController } from "./canvasNavigation.js";
import { Connections } from "./connections.js";
import { Connection } from "./connection.js";

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

    public connectedTo: Connection[] = [];
    
    static SocketID = 0;
    private static socketRegistry: Map<HTMLDivElement, Socket> = new Map();
    public connections = Connections.getInstance();

    
    constructor(datatype: DataType, socketType: SocketType, ypos: number) {
        this.id = Socket.SocketID++;
        this.socketType = socketType;
        this.dataType = datatype;

        this.socketDiv = this.createDiv(ypos);
        this.circleDiv = this.createCircle();
        this.socketDiv.appendChild(this.circleDiv);
        
        Socket.socketRegistry.set(this.socketDiv, this);
        this.addListeners();
    }

    private createDiv(yPos:number): HTMLDivElement {
        const socketDiv = document.createElement("div");
        socketDiv.style.cssText = `
            width: 25px;
            height: 25px;
            position: absolute;
            left: ${this.socketType === SocketType.INPUT ? "-10px" : "170px"};
            top: ${yPos}px;
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
            pointer-events: none;
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


    private addListeners(): void {
        this.socketDiv.addEventListener('mousedown', (e: MouseEvent) => {
            e.stopPropagation();
            if (!this.connections.getLineStatus()) {
                this.startPossibleConnection(e);
            }
        });
    }

   private startPossibleConnection(e: MouseEvent): void {
        e.stopPropagation();
        
        const pos = this.getCanvasPosition();
        const mousePos = CanvasController.screenToCanvas(e.clientX, e.clientY);
        this.connections.createTempLine(pos.x, pos.y, mousePos.x, mousePos.y);
                
        const onMove = (e: MouseEvent) => {
            e.stopPropagation();
            const currentMousePos = CanvasController.screenToCanvas(e.clientX, e.clientY);
            this.connections.updateTempLine(currentMousePos.x, currentMousePos.y);
        };
        
        const onMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onMouseUp);
            
            this.endPossibleConnection(e);
        };
        
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onMouseUp); 
    }

    private endPossibleConnection(e: MouseEvent): void {
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        this.connections.removeTempLine();        
        if (!targetElement) {
            return; 
        }
        const targetSocket = Socket.socketRegistry.get(targetElement as HTMLDivElement)
            if (targetSocket && (targetSocket.socketType != this.socketType)) {
                this.connect(targetSocket);
            }        
    }

    public connect(target: Socket): void {
        const { BaseSocket, EndSocket } = this.socketType === SocketType.INPUT 
            ? { BaseSocket: target, EndSocket: this }
            : { BaseSocket: this, EndSocket: target };

        const pos1 = BaseSocket.getCanvasPosition();
        const pos2 = EndSocket.getCanvasPosition();

        const connection = this.connections.createConnection(pos1.x, pos1.y, pos2.x, pos2.y, this, target);
        if (connection){
            this.connectedTo.push(connection);
            target.connectedTo.push(connection);
        }
    }

    public disconnect(connection: Connection): void {
        connection.destroy()
    }

    private disconnectAll(): void {
        [...this.connectedTo].forEach(connection => this.disconnect(connection));
    }
}