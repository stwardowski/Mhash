import { Connection } from "./connection.js";
import { Socket } from "./socket.js";

type templine = SVGLineElement | null
export class Connections {
    private static instance: Connections;
    private svgCanvas: SVGSVGElement;
    private connections: Connection[] = [];
    private tempLine: templine = null;

    private constructor() {
        this.svgCanvas = this.createSvgCanvas();
        this.setupLineDeletion();
    }

    public static init(): Connections {
        if (!Connections.instance) {
            Connections.instance = new Connections();
        }
        return Connections.instance;
    }

    public static getInstance(): Connections {
        if (!Connections.instance) {
            throw new Error('Connections not initialized!');
        }
        return Connections.instance;
    }
    
    public showSVGPointerEvents(): void {
        this.svgCanvas.style.pointerEvents = 'auto';
    }

    public hideSVGPointerEvents(): void {
        this.svgCanvas.style.pointerEvents = 'none';
    }

    public getLineStatus(){
        return this.tempLine
    }

    private createSvgCanvas(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "connections-layer");
        svg.id = "SVGCanvas";
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        `;
        return svg;
    }

    public getSvgCanvas(): SVGSVGElement {
        return this.svgCanvas;
    }

    private makeLine(x1: number, y1: number, x2: number, y2: number, lineClass: string){
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("class", lineClass);
        line.style.pointerEvents = 'stroke';
        line.style.cursor = 'pointer';
        return line;
    }
    
    private connectionExists(base: Socket, target: Socket): boolean {
        return this.connections.some(conn => 
            (conn['socketBase'] === base && conn['socketConnected'] === target) ||
            (conn['socketBase'] === target && conn['socketConnected'] === base)
        );
    }
    
    public createConnection(x1: number, y1: number, x2: number, y2: number, base: Socket, target: Socket): Connection | null {
        if (this.connectionExists(base, target)) {
            return null;
        }
        
        if (base === target) {
            return null;
        }
        
        const line = this.makeLine(x1, y1, x2, y2, "line-connection")
        this.svgCanvas.appendChild(line);
        const connection = new Connection(base, target, line);
        
        this.connections.push(connection);
        
        line.addEventListener('click', (event) => {
            event.stopPropagation();
            this.deleteConnection(connection);
        });
        
        return connection;
    }

    public createTempLine(x1: number, y1: number, x2: number, y2: number): void {
        this.removeTempLine();
         
        const line = this.makeLine(x1,y1,x2,y2,"line-temp")
        line.style.pointerEvents = 'none';
        this.svgCanvas.appendChild(line);
        this.tempLine = line;
    }

    public updateTempLine(x2: number, y2: number): void {
        if (this.tempLine) {
            this.tempLine.setAttribute("x2", `${x2}`);
            this.tempLine.setAttribute("y2", `${y2}`);
        }
    }

    public removeTempLine(): void {
        if (this.tempLine) {
            this.tempLine.remove();
            this.tempLine = null;
        }
    }

    public deleteConnection(connection: Connection): void {
        const index = this.connections.indexOf(connection);
        if (index !== -1) {
            this.connections.splice(index, 1);
        }
        
        connection.destroy();
    }

    public deleteAllConnections(): void {
        this.connections.forEach(connection => connection.destroy());
        this.connections = [];
    }

    private setupLineDeletion(): void {
        this.svgCanvas.addEventListener('mouseover', (event) => {
            const target = event.target as SVGElement;
            if (target && target.tagName === 'line' && target.classList.contains('line-connection')) {
                target.classList.add('line-hover');
            }
        });
        
        this.svgCanvas.addEventListener('mouseout', (event) => {
            const target = event.target as SVGElement;
            if (target && target.tagName === 'line' && target.classList.contains('line-connection')) {
                target.classList.remove('line-hover');
            }
        });
    }
}