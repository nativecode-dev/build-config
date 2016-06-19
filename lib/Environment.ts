export interface Environment {
    appdir: string;
    datadir: string;
}

export interface EnvironmentFileSystem {
    cwd: string;

    basename(filename: string): string;
    exists(filename: string, cwd?: string): boolean;
    normalize(filename: string): string;
    resolve(...parts: string[]): string;
}