export class Connections {
    private static instance: Connections;
    private svgCanvas: SVGSVGElement;
    private connectionLines: Map<string, SVGLineElement> = new Map();
    private tempLine: SVGLineElement | null = null;

    private constructor() {
        this.svgCanvas = this.createSvgCanvas();
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

    public createConnection(x1: number, y1: number, x2: number, y2: number, id: string): SVGLineElement {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("stroke", "#ff0000");
        line.setAttribute("stroke-width", "2");
        line.dataset.connectionId = id;
        
        this.svgCanvas.appendChild(line);
        this.connectionLines.set(id, line);
        return line;
    }

    public updateConnection(id: string, x1: number, y1: number, x2: number, y2: number): void {
        const line = this.connectionLines.get(id);
        if (line) {
            line.setAttribute("x1", `${x1}`);
            line.setAttribute("y1", `${y1}`);
            line.setAttribute("x2", `${x2}`);
            line.setAttribute("y2", `${y2}`);
        }
    }

    public removeConnection(id: string): void {
        const line = this.connectionLines.get(id);
        if (line) {
            line.remove();
            this.connectionLines.delete(id);
        }
    }

    public createTempLine(x1: number, y1: number, x2: number, y2: number): void {
        this.removeTempLine();
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("stroke", "#0ff");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("stroke-dasharray", "5,5");
        
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
}