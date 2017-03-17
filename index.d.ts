declare var goat: Goat.IGoat;

declare module 'goat.js' {
    export = goat;
}

namespace Goat {
    interface IGoat {
        new (expression: string, controller: any): IGoat;
        evaluate(): boolean;
    }
}