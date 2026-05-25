import { Socket } from "./socket.js"

export class Connection {
    private socketConnected: Socket;
    private socketBase: Socket;
    private line: SVGLineElement;

    constructor(base: Socket, target: Socket, line: SVGLineElement) {
        this.socketConnected = target;
        this.socketBase = base;
        this.line = line;
    }

    public getBaseSocket(): Socket {
        return this.socketBase;
    }

    public getConnectedSocket(): Socket {
        return this.socketConnected;
    }

    public updateLine(x1: number, y1: number, x2: number, y2: number) {
        this.line.setAttribute("x1", `${x1}`);
        this.line.setAttribute("y1", `${y1}`);
        this.line.setAttribute("x2", `${x2}`);
        this.line.setAttribute("y2", `${y2}`);
    }

    public updateLineEndpoint(x2: number, y2: number) {
        this.line.setAttribute("x2", `${x2}`);
        this.line.setAttribute("y2", `${y2}`);
    }

    public updateLineBasepoint(x1: number, y1: number) {
        this.line.setAttribute("x1", `${x1}`);
        this.line.setAttribute("y1", `${y1}`);
    }

    public destroy() {
        if (this.socketBase && this.socketBase.connectedTo) {
            const indexInBase = this.socketBase.connectedTo.indexOf(this);
            if (indexInBase !== -1) {
                this.socketBase.connectedTo.splice(indexInBase, 1);
            }
        }
        
        if (this.socketConnected && this.socketConnected.connectedTo) {
            const indexInConnected = this.socketConnected.connectedTo.indexOf(this);
            if (indexInConnected !== -1) {
                this.socketConnected.connectedTo.splice(indexInConnected, 1);
            }
        }
        
        if (this.line && this.line.parentNode) {
            this.line.parentNode.removeChild(this.line);
        }
    }
}