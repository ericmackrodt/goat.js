declare module 'goat.js' {
    export = Goat;
}

namespace Goat {
    export class Goat {
        constructor (expression: string, controller: any);
        evaluate(): boolean;
    }
}