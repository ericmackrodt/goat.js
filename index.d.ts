declare module 'goat.js' {
    export = Goat;
}

declare namespace Goat {
    export class Goat {
        fields: string[];
        constructor (expression: string, controller: any);
        evaluate(): boolean;
    }
}