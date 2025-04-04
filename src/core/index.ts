import { CoreConfig } from "../composables";

export interface ListCondig<T>{
    removeAtEvent: (index: number) => T | undefined;
    insertEvent: (index: number, value: T) => void;
    getLength: () => number,
    getValue: (index: number) => T
    insertToListEmpty: (config: CoreConfig<T>, index: number, value: T) => void
}