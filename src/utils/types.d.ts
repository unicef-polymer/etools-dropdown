import { Constructor } from "lit-element";
export declare type MixinTarget<T extends object> = Constructor<{
    [p in keyof T]: T[p];
}>;
