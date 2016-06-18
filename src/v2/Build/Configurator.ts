import {FileType} from './FileType'

export const SourceTypes = {
    Css: new FileType(['css']),
    Html: new FileType(['htm', 'html']),
    JavaScript: new FileType(['js']),
}

export class ConfiguratorOptions {
}

export class Configurator {
    constructor(options: ConfiguratorOptions) {

    }
}
