export class Dropdown {
    private current: string;
    private select: HTMLSelectElement;
    
    constructor(droplist: string[]) {
        this.current = droplist[0];
        
        this.select = document.createElement("select")
        this.select.className = "dropdown";
        
        droplist.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            this.select.appendChild(option);
        });
        
        this.select.value = this.current;
        
        this.select.addEventListener('change', () => {
            this.current = this.select.value;
        });
        
    }

    public getCurrent(): string {
        return this.current;
    }
    public getElement(): HTMLSelectElement {
        return this.select;
    }
}

export class BitSize {
    private currentSize: string;
    private button: HTMLButtonElement;
    private sizes: string[];
    
    constructor(id: string, optionalSizes?: string[]) {
        this.sizes = optionalSizes && optionalSizes.length > 0 
            ? optionalSizes 
            : ['8bit', '16bit', '32bit', '64bit'];
        
        this.currentSize = this.sizes[0];        
        this.button = document.createElement("button");
        this.button.className = "button";
        this.button.id = id;
        this.button.textContent = this.currentSize;
        
        this.button.addEventListener('click', () => {
            this.cycleSize();
        });
    }
    
    private cycleSize(): void {
        const currentIndex = this.sizes.indexOf(this.currentSize);
        this.currentSize = this.sizes[(currentIndex + 1) % this.sizes.length];
        this.button.textContent = this.currentSize;
    }
    
    public getCurrent(): string {
        return this.currentSize;
    }
    
    public getElement(): HTMLButtonElement {
        return this.button;
    }
}