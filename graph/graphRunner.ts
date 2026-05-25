import { NodeKind } from "../nodes/node.js";
import { JSONConverter, Graph, JsonNode } from "./JSONconverter.js";

export class GraphRunner {
    private graph: Graph;
    
    constructor(graph: Graph){
        this.graph = graph
    }

    public run(){

    }
    public step(){

    }

    private executeNode(node: JsonNode, inputs: any) {
        switch (node.kind) {
            case NodeKind.OUTPUT:
                return inputs[0];
                
            case NodeKind.BITSHIFT: {
                const value = BigInt(inputs[0] || 0);
                const amount = BigInt(node.properties.amount || 0);
                return node.properties.way === 'left' ? value << amount : value >> amount;
            }
                
            case NodeKind.BITLOGIC: {
                const a = BigInt(inputs[0] || 0);
                const b = BigInt(inputs[1] || 0);
                switch (node.properties.operation) {
                    case 'AND': return a & b;
                    case 'OR': return a | b;
                    case 'XOR': return a ^ b;
                    case 'NOT': return ~a;
                    default: return a;
                }
            }
                
            case NodeKind.MATH: {
                const a = Number(inputs[0] || 0);
                const b = Number(inputs[1] || 0);
                switch (node.properties.operation) {
                    case 'ADD': return a + b;
                    case 'SUB': return a - b;
                    case 'MUL': return a * b;
                    case 'DIV': return Math.floor(a / b);
                    case 'MOD': return a % b;
                    default: return a;
                }
            }
                
            case NodeKind.MERGE:
                return inputs.join('');
                
            case NodeKind.SPLIT:
                return inputs[0];
                
            case NodeKind.VARIABLE:
                return node.properties.input || inputs[0];
                
            case NodeKind.ARRAY:
                return inputs;
                
            default:
                return inputs[0];
        }
    }
    
}