import { GRAB_CLASS } from "./utils/classes";
import { addClass, toggleClass } from "./utils/dom/classList";

export default class HandlerPublisher{
    handlers: Element [];
    constructor() {
        this.handlers = []
    }
    addSubscriber(subscriber: Element){
        if (this.handlers.includes(subscriber)) {
            return
        }
        this.handlers.push(subscriber)
        addClass(subscriber, GRAB_CLASS)
    }
    toggleGrabClass(force:boolean){
        for (const handler of this.handlers) {
            toggleClass(handler, GRAB_CLASS, force)
        }
    }
}