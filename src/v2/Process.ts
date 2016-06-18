import {Environment, EnvironmentFileSystem} from './Environment';

import fs = require('fs');
import {} from 'path';
import {} from 'process';

class ProcessEnvironmentFileSystem implements EnvironmentFileSystem {
    get cwd(): string {
        return process.cwd();
    }

    basename(filename: string): string {
        return path.basename(filename)
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
