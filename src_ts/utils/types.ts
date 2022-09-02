import {Constructor} from 'lit-element';

export type MixinTarget<T extends object> = Constructor<{
  // Enumerate only public members to avoid the following compiler error:
  //   Property '(some-name)' of exported class expression
  //   may not be private or protected. ts(4094)
  [p in keyof T]: T[p];
}>;
