import { CanvasController } from "./canvasNavigation.js";
import { BaseNode, NodeKind } from "../nodes/node.js";
import { Socket } from "./socket.js";

interface NodeExportData {
    id: number;
    kind: NodeKind;
    properties: Record<string, any>;
}

export class JSONConverter {
    private canvasController;
    private nodeManager;

    constructor() {
        this.canvasController = CanvasController.getInstance();
        this.nodeManager = this.canvasController.getNodeManager();
    }

    private exportNodes(): NodeExportData[] {
        const nodes: NodeExportData[] = [];
        
        this.nodeManager.getNodes().forEach((node: BaseNode) => {
            const nodeData: NodeExportData = {
                id: node.getID(),
                kind: node.getKind(),
                properties: this.extractNodeProperties(node)
            };
            
            nodes.push(nodeData);
        });
        return nodes;
    }

    private extractNodeProperties(node: any): Record<string, any> {
        const properties: Record<string, any> = {};
        
        const kind = node.kind; 
        
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
        
        if (node.getSockets) {
            properties.sockets = this.extractSockets(node);
        }
        
        return properties;
    }

    private extractSockets(node: any): Record<string, any>[] {
        const sockets = node.getSockets();
        const socketData: Record<string, any>[] = [];
        
        sockets.forEach((socket: Socket) => {
            socketData.push({
                id: socket.id,
                dataType: socket.dataType,
                socketType: socket.socketType
            });
        });
        
        return socketData;
    }
}