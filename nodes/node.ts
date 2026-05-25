import { CanvasController } from "../others/canvasNavigation.js";
import { Connections } from "../others/connections.js";
import { Connection } from "../others/connection.js";
import { SocketScheme, DataType, SocketType, Socket} from "../others/socket.js";

export enum NodeKind {
    INPUT,
    OUTPUT,
    MATH,
    BITLOGIC, 
    BITSHIFT,
    VARIABLE,
    ARRAY,
    SPLIT,
    MERGE
}

export abstract class BaseNode {
    protected container: HTMLDivElement;
    protected sockets: Socket[] = [];

    private startY = 50;
    static gap = 25;

    static ID = 0 
    public ID;
    
    public currentIN_Y = this.startY
    public currentOUT_Y = this.startY

    protected abstract nodeKind: NodeKind;
    protected content;
    protected rows = []
    private isDragging = false;
    static Zindex = 1;

    constructor(socketSchemes: SocketScheme[]) {
        this.ID = BaseNode.ID;
        BaseNode.ID++
        this.container = document.createElement("div");
        this.container.className = "node";
        this.container.style.position = "absolute"; 

        this.createSockets(socketSchemes, this.sockets);        
        this.createHeader();
        this.content = this.createNodeContent();
        this.container.appendChild(this.content);
    }

    protected createSockets(socketSchemes: SocketScheme[], socketsToWriteTo: Socket[]) {
        socketSchemes.forEach(([dataType, socketType]) => {
            const newSocket = new Socket(dataType, socketType, this);

            if (socketType === SocketType.INPUT) {
                this.currentIN_Y += BaseNode.gap;
            } else {
                this.currentOUT_Y += BaseNode.gap;
            }

            this.container.appendChild(newSocket.socketDiv);
            socketsToWriteTo.push(newSocket);
        });
    }

    protected updateSocketPosition(){
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
    }


    private createHeader(): void {
        const header = document.createElement("div");
        header.className = "node-header";
        header.innerText = NodeKind[this.nodeKind];
        header.style.cursor = "grab";
        
        let startX = 0, startY = 0, nodeX = 0, nodeY = 0;
        
        header.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button !== 0) return;
            this.isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            nodeX = parseFloat(this.container.style.left) || 0;
            nodeY = parseFloat(this.container.style.top) || 0;
            header.style.cursor = "grabbing";
            this.container.style.zIndex = `${BaseNode.Zindex++}`;
            e.preventDefault();
            e.stopPropagation();
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const scale = CanvasController.getInstance().getScale();
            this.container.style.left = `${nodeX + (e.clientX - startX) / scale}px`;
            this.container.style.top = `${nodeY + (e.clientY - startY) / scale}px`;
            this.updateSocketPosition()
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
            header.style.cursor = "grab";
        });

        this.container.appendChild(header);
    }

    private createNodeContent(){
        const content = document.createElement("div");
        content.className = "node-content";
        return content
    }    

    public getContainer(){
        return this.container;
    }

    public newRow(content: HTMLElement) {
        const row = document.createElement("div");
        row.className = "row";
        row.appendChild(content);    
        this.content.appendChild(row);
    }
    public getSockets() {
        return this.sockets;
    }
    public getID() {
        return this.ID;
    }
    public getKind(){
        return this.nodeKind;
    }
}