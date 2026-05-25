import { JSONConverter } from "./JSONconverter.js";
import { GraphRunner } from "./graphRunner.js";
import { NodeKind } from "../nodes/node.js";

export class GraphController {
    private runner: GraphRunner;
    private converter: JSONConverter;
    
    private runButton!: HTMLButtonElement;
    private stepButton!: HTMLButtonElement;
    private resetButton!: HTMLButtonElement;
    private container: HTMLDivElement;

    constructor() {
        this.converter = new JSONConverter();
        this.runner = new GraphRunner(this.converter.getGraph())
        this.container = this.createUI();
        document.body.appendChild(this.container);
    }

    private createUI(): HTMLDivElement {
        const container = document.createElement("div");
        container.id = "execution-controls";
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 20px;
            z-index: 1000;
        `;


        this.runButton = this.createButton("▶ RUN");
        this.stepButton = this.createButton("→ STEP");
        this.resetButton = this.createButton("↺ RESET");

        this.runButton.onclick = () => this.run();
        this.stepButton.onclick = () => this.step();
        this.resetButton.onclick = () => this.reset();

        container.appendChild(this.runButton);
        container.appendChild(this.stepButton);
        container.appendChild(this.resetButton);

        return container;
    }

    private createButton(text: string): HTMLButtonElement {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = "button";
        btn.style.cssText = `
            padding: 8px 16px;
            min-width: 80px;
        `;
        return btn;
    }

    public run(): void {
        this.converter?.printJSON()
    }

    public step(): void {
        
    }

    public reset(): void {
    
    }
}