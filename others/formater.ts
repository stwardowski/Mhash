export type InFormat = 'BIN' | 'TEXT' | 'HEX' | 'DEC';

export const placeholders: Record<InFormat, string> = {
    'BIN': '1000011',
    'HEX': '9AF4DB1',
    'TEXT': 'Message',
    'DEC': '12345',
};

export const regexes: Record<InFormat, string> = {
    'BIN': '^[01]{1,64}$',           
    'HEX': '^[0-9A-Fa-f]{1,32}$',    
    'TEXT': '^(?!\\s*$).+',           
    'DEC': '^[1-9][0-9]*$|^0$',      
};

export class FormatManager {
    protected format: InFormat;
    protected select: HTMLSelectElement;
    protected message: string = '';

    protected static formatToBase: Record<InFormat, number> = {
        'BIN': 2,
        'DEC': 10,
        'HEX': 16,
        'TEXT': -1
    };

    constructor(initialFormat: InFormat = 'BIN', select: HTMLSelectElement) {
        this.format = initialFormat;
        this.select = select;
        this.select.value = initialFormat;
        this.select.addEventListener('change', this.handleFormatChange.bind(this));
    }

    private handleFormatChange(): void {
        const oldFormat = this.format;
        this.format = this.select.value as InFormat;
        
        if (this.message) {
            this.message = this.convert(this.message, oldFormat, this.format);
        }
        
        this.onFormatChanged(); 
    }

    protected onFormatChanged(): void {
    }

    public getMessage(): string {
        return this.message;
    }

    public getFormat(): InFormat {
        return this.format;
    }

    public convert(value: string, from: InFormat, to: InFormat): string {
        if (!value) return '';

        try {
            const num = this.toNumber(value, from);
            if (isNaN(num)) return '';
            return this.fromNumber(num, to);
        } catch {
            return '';
        }
    }

    protected toNumber(value: string, format: InFormat): number {
        if (format === 'TEXT') {
            return value.length > 0 ? value.charCodeAt(0) : NaN;
        }
        
        const base = FormatManager.formatToBase[format];
        return parseInt(value, base);
    }

    protected fromNumber(num: number, format: InFormat): string {
        if (format === 'TEXT') {
            return String.fromCharCode(Math.round(num));
        }
        
        const base = FormatManager.formatToBase[format];
        return num.toString(base).toUpperCase();
    }

    public static isValidChar(char: string, format: InFormat): boolean {
        const regex = FormatManager.getRegex(format);
        return regex.test(char);
    }

    public static getRegex(format: InFormat): RegExp {
        return new RegExp(regexes[format]);
    }
}