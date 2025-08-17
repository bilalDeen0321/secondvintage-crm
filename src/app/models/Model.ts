import { readonly } from "../utils";

class Model {

    /**
     * Create a new static instance
     */
    public static init<T extends typeof Model>(this: T): InstanceType<T> {
        return new this() as InstanceType<T>;
    }
}

readonly(Model, ['init']);

export default Model;