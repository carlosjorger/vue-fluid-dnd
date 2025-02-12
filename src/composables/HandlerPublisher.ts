import { GRAB_CLASS } from "../utils/classes";

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
        subscriber.classList.add(GRAB_CLASS)
    }
    toggleGrabClass(force:boolean){
        for (const handler of this.handlers) {
            handler.classList.toggle(GRAB_CLASS, force)
        }
    }
}