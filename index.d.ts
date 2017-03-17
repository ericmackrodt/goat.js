declare module 'goat.js' {
    export = Goat;
}

namespace Goat {
    export class Goat {
        get fields(): string[];
        constructor (expression: string, controller: any);
        evaluate(): boolean;
    }
}