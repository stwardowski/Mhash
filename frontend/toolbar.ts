const NODE_TYPES = [
    "INPUT", "OUTPUT", "MATH", "BITLOGIC", 
    "VARIABLE", "ARRAY", "SPLIT", "MERGE", 
    "LOOP", "SBOX"
];

export class ToolBar
{
    container: HTMLDivElement;
    tools: Tool[] = [];
    parent = document.getElementById("tools");
    
    constructor()
    {
        this.container = document.createElement('div');
        this.parent?.appendChild(this.container);
        
        for (let i = 0; i < NODE_TYPES.length; i++)
        {
            this.tools.push(new Tool(NODE_TYPES[i]));
            this.container.appendChild(this.tools[i].container);
        }
    }
}


class Tool
{
    container: HTMLDivElement;
    toolType: String;
    
    constructor(toolType: String)
    {
        this.container = document.createElement('div');
        this.toolType = toolType;
    }
}