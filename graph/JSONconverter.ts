import { CanvasController } from "../others/canvasNavigation.js";
import { BaseNode, NodeKind } from "../nodes/node.js";
import { Socket, SocketType } from "../others/socket.js";
import { Connection } from "../others/connection.js";
import { Connections } from "../others/connections.js";

export interface JsonNode {
    id: number;
    kind: NodeKind;
    properties: Record<string, any>;
}

export interface JsonConnection {
    from: { nodeId: number; socketId: number };
    to: { nodeId: number; socketId: number };
}


export class Graph {
    nodes: JsonNode[];
    connections: JsonConnection[];

    constructor(node: JsonNode[], jsonConnections: JsonConnection[]) {
        this.nodes = node;
        this.connections = jsonConnections;
    }
}

export class JSONConverter {
    private canvasController: CanvasController;
    private nodeManager: any;
    private connectionsManager: Connections;

    private nodeGraph: Graph | null = null;

    constructor() {
        this.canvasController = CanvasController.getInstance();
        this.nodeManager = this.canvasController.getNodeManager();
        this.connectionsManager = Connections.getInstance();
    }

    public getGraph(): Graph {
        const nodes = this.exportNodes();
        const connections = this.exportConnections();
        this.nodeGraph = new Graph(nodes, connections)
        return this.nodeGraph;
    }

    public getJSONString(): string {
        return JSON.stringify(this.getGraph(), null, 2);
    }

    public printJSON(): void {
        console.log(this.getJSONString());
    }

    private exportNodes(): JsonNode[] {
        const nodes: JsonNode[] = [];
        
        this.nodeManager.getNodes().forEach((node: BaseNode) => {
            nodes.push({
                id: node.getID(),
                kind: node.getKind(),
                properties: this.extractNodeProperties(node)
            });
        });
        
        return nodes;
    }

    private extractNodeProperties(node: any): Record<string, any> {
        const properties: Record<string, any> = {};
        const kind = node.getKind();
        
        switch (kind) {
            case NodeKind.ARRAY: 
                properties.mode = node.getMode?.();
                break;
            case NodeKind.VARIABLE: 
                properties.format = node.getFormat?.();
                properties.input = node.getInput?.();
                properties.type = node.getType?.();
                break;            
            case NodeKind.BITLOGIC: 
                properties.operation = node.getOperation?.();
                break;
            case NodeKind.BITSHIFT: 
                properties.type = node.getType?.();
                properties.way = node.getWay?.();
                properties.amount = node.getAmount?.();
                break;
            case NodeKind.INPUT: 
                properties.format = node.getFormat?.();
                properties.input = node.getInput?.();
                break;
            case NodeKind.OUTPUT: 
                properties.format = node.getFormat?.();
                break;
            case NodeKind.MATH: 
                properties.operation = node.getOperation?.();
                properties.type = node.getType?.();
                break;
            case NodeKind.MERGE: 
                break;
            case NodeKind.SPLIT: 
                properties.type = node.getType?.();
                break;
        }
        
        properties.sockets = this.extractSockets(node);
        return properties;
    }

    private extractSockets(node: any): Record<string, any>[] {
        return node.getSockets().map((socket: Socket) => ({
            id: socket.id,
            dataType: socket.dataType,
            socketType: socket.socketType
        }));
    }

    private exportConnections(): JsonConnection[] {
        const allConnections = this.connectionsManager.getAllConnections();
        
        return allConnections.map((conn: Connection) => {
            const baseSocket = conn.getBaseSocket();
            const connectedSocket = conn.getConnectedSocket();
            
            const baseNode = baseSocket.getNodeParent()
            const connectedNode = connectedSocket.getNodeParent()
            
            return {
                from: { nodeId: baseNode.getID(), socketId: baseSocket.id },
                to: { nodeId: connectedNode.getID(), socketId: connectedSocket.id }
            };

        });
    }

}