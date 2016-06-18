export class FileType {
    private _extensions: string[];

    constructor(extensions: string[]) {
        this._extensions = extensions;
    }

    get extensions(): string[] {
        return this._extensions;
    }

    get extensionsWithDot(): string[] {
        return this._extensions.map(value => `.${value}`)
    }

    matches(filename: string): boolean {
        return false;
    }
}
