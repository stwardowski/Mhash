import { NodeManager } from "./nodeManager.js";
import { NodeKind } from "../nodes/node.js";
import { Connections } from "./connections.js";

export class CanvasController {
    private static instance: CanvasController;
    
    private background: HTMLElement;
    private innerContainer: HTMLElement;
    private nodeManager: NodeManager;
    private connections: Connections;
    
    private scale: number = 1;
    private isPanning = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private offsetX = 0;
    private offsetY = 0;
    
    private readonly MIN_SCALE = 0.1;
    private readonly MAX_SCALE = 3;
    private readonly ZOOM_SPEED = 0.001;
    
    private constructor(background: HTMLElement) {
        this.background = background;
        this.background.style.position = "relative";
        this.background.style.overflow = "hidden";
        
        this.connections = Connections.getInstance();
        this.innerContainer = this.createContainer();
        
        this.background.appendChild(this.innerContainer);
        this.innerContainer.appendChild(this.connections.getSvgCanvas());
        
        this.nodeManager = new NodeManager(this.innerContainer);
        
        const wrapperRect = this.background.getBoundingClientRect();
        this.offsetX = wrapperRect.width / 2 - 10000;
        this.offsetY = wrapperRect.height / 2 - 10000;

        this.updateTransform();
        this.init();
    }

    public static getInstance(background?: HTMLElement): CanvasController {
        if (!CanvasController.instance) {
            if (!background) {
                throw new Error("CanvasController must be initialized with background element first");
            }
            CanvasController.instance = new CanvasController(background);
        }
        return CanvasController.instance;
    }

    public getNodeManager(): NodeManager {
        return this.nodeManager;
    }

    public getConnections(): Connections {
        return this.connections;
    }

    public getScale(): number {
        return this.scale;
    }

    public getOffset(): { x: number; y: number } {
        return { x: this.offsetX, y: this.offsetY };
    }

    public getInnerContainer(): HTMLElement {
        return this.innerContainer;
    }

    public screenToCanvas(screenX: number, screenY: number): { x: number; y: number } {
        const rect = this.innerContainer.getBoundingClientRect();
        return {
            x: (screenX - rect.left) / this.scale,
            y: (screenY - rect.top) / this.scale
        };
    }

    public setViewport(offsetX: number, offsetY: number, scale: number): void {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.scale = Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, scale));
        this.updateTransform();
    }

    private createContainer(): HTMLElement {
        const container = document.createElement("div");
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 20000px;
            height: 20000px;
            transform-origin: 0 0;
        `;
        return container;
    }

    private onWheel(e: WheelEvent): void {
        e.preventDefault();
        
        const rect = this.background.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const oldScale = this.scale;
        const delta = -e.deltaY * this.ZOOM_SPEED;
        this.scale = Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, this.scale + delta));
        
        const scaleChange = this.scale / oldScale;
        this.offsetX = mouseX - (mouseX - this.offsetX) * scaleChange;
        this.offsetY = mouseY - (mouseY - this.offsetY) * scaleChange;
        
        this.updateTransform();
    }

    private init(): void {
        this.background.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.background.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    private onMouseDown(e: MouseEvent): void {
        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            this.isPanning = true;
            this.dragStartX = e.clientX - this.offsetX;
            this.dragStartY = e.clientY - this.offsetY;
            this.background.style.cursor = 'grabbing';
            return;
        }
        
        if (e.button === 0 && !e.ctrlKey) {
            const target = e.target as HTMLElement;
            
            if (!target.closest('.node')) {
                const { x, y } = this.screenToCanvas(e.clientX, e.clientY);
                this.nodeManager.createNodeAt(x, y);
            }
        }
    }

    private onMouseMove(e: MouseEvent): void {
        if (this.isPanning) {
            this.offsetX = e.clientX - this.dragStartX;
            this.offsetY = e.clientY - this.dragStartY;
            this.updateTransform();
        }
    }

    private onMouseUp(): void {
        this.isPanning = false;
        this.background.style.cursor = 'default';
    }

    private onKeyDown(e: KeyboardEvent): void {
        if (e.ctrlKey || e.metaKey) return;
        if (document.activeElement !== document.body && document.activeElement !== this.background) return;
        
        const numKey = parseInt(e.key);
        if (numKey >= 1 && numKey <= 9) {
            e.preventDefault();
            const nodeKind = (numKey - 1) as NodeKind;
            this.nodeManager.setPlacementMode(true, nodeKind);
            this.background.style.cursor = 'crosshair';
        }
        
        if (e.key === 'Escape') {
            this.nodeManager.setPlacementMode(false, null);
            this.background.style.cursor = 'default';
        }
    }

    private updateTransform(): void {
        const transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
        this.innerContainer.style.transform = transform;
    }

    public destroy(): void {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('keydown', this.onKeyDown);
        this.background.removeChild(this.innerContainer);
    }
}