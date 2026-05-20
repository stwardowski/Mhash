import { FormatManager, InFormat, placeholders } from "./formater.js";

export class inputFormater extends FormatManager {
    private input: HTMLTextAreaElement;

    constructor(initialFormat: InFormat = 'BIN', select: HTMLSelectElement, input: HTMLTextAreaElement) {
        super(initialFormat, select);
        this.input = input;
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.updateInput();
    }

    protected onFormatChanged(): void {
        this.updateInput();
    }

    private handleInput(): void {
        if (!this.input) return;
        
        const regex = FormatManager.getRegex(this.format);
        const filtered = this.input.value
            .split('')
            .filter(char => regex.test(char))
            .join('');

        this.input.value = filtered;
        this.message = filtered;
    }

    private updateInput(): void {
        this.input.value = this.message;    
        this.input.placeholder = placeholders[this.format];
    }
}