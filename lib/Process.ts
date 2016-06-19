/// <reference path="../typings/index.d.ts" />

import {Environment, EnvironmentFileSystem} from './Environment';

class ProcessEnvironmentFileSystem implements EnvironmentFileSystem {
    get cwd(): string {
        return process.cwd();
    }

    basename(filename: string): string {
        return path.basename(filename)
    }

    exists(filename: string): string {

    }
}

class ProcessEnvironment implements Environment {
    private _files: ProcessEnvironmentFileSystem = new ProcessEnvironmentFileSystem();

    get appdir(): string {
        return this.files.cwd;
    }

    get datadir(): string {
        return this.appdir;
    }

    get files(): ProcessEnvironmentFileSystem {
        return this._files;
    }
}

export default class BuildConfig {

}
