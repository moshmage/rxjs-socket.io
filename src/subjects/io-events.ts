import {IoEventInfo, initialEvent, ReceivedEvent} from "./../interfaces/socket-io";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export class ioEvent {
    /** this is the reference for a io() value */
    private clientSocket: any;

    /** the actual Rx Subject */
    private _lastEvent: BehaviorSubject<ReceivedEvent> = new BehaviorSubject<ReceivedEvent>(initialEvent);

    /**
     * This function is called at every value update so extenders of ioEvent can have their own
     * logic after a new update. This should be used to update services, etc.. etc.. - please:
     * don't use this function as a callback hell. use it as a clutch.
     * @param newData
     */
    private updateData(newData) {
        this._lastEvent.next(newData);
        this.event.count++; /** we will be using "count" has a way of knowing if it has been triggered. */
        if (this._onUpdate) this._onUpdate(newData); /** a way for us to extend properly */
    }
    private _onUpdate: Function;
    
    constructor(public event: IoEventInfo) {
        this.event = event;
        this.event.count = event.count || 0;
        this.event.once = event.once || false;
    }

    /**
     * The Subscribable (Observable) prop
     * subscribe to this prop to be notified of data update
     * @type {Observable<ReceivedEvent>}
     */
    public event$: any = this._lastEvent.asObservable();

    /**
     * returns whether the event has triggered or not
     * @returns {boolean}
     */
    public get hasTriggered() { return this.event.count > 0; }

    /**
     * returns if the event is unique or not
     * @returns {boolean}
     */
    public get isUnique() {return this.event.once === true; }

    /**
     * Returns the event name
     * @returns {string}
     */
    public get name() {return this.event.name; }

    /** Make it so it's not callable from the outside
     * so we don't have to worry about lost callbacks and binds */
    private get onUpdate() {return this._onUpdate;}

    /**
     * hook() is an alias to `socket.on()` or `socket.once()` depending on the provided `IoEventInfo`
     * @param clientSocket {Socket}
     */
    public hook(clientSocket) :void {
        this.clientSocket = clientSocket || this.clientSocket;
        if (!this.clientSocket) throw Error('ioEvent has no socket to hook to.');
        if (this.event.once) {
            this.event.count = 0;
            this.clientSocket.once(this.event.name, (data) => this.updateData(data));
        }
        else this.clientSocket.on(this.event.name, (data) => this.updateData(data));

        /** This is where magic happens. The callback for every ioEvent is a `SubjectBehavior.next()` call
         * so we can safely `.subscribe()` to the public `event$` prop that each ioEvent has */
    }

    /** unhook is an alias for "off", and since we only have one real callback attached to the Emitter
     * we don't need to pass a `fn` argument */
    public unhook() :void {
        if (this.event.once) return;
        this.clientSocket.off(this.event.name);
    }

    /**
     * a reference to the subscription .getValue()
     * @returns {ReceivedEvent}
     */
    public get lastEvent() {return this._lastEvent.getValue(); }

    /**
     * This function acts as a prive to make actions when your extended ioEvent
     * gets new data. if the ioEvent is of type unique you can then use .hook()
     * so re-hook the event as a .once() again.
     *  ioEvent.onUpdate will be called with `newData` if it's truthy
     * @param fn {Function}
     */
    private set onUpdate(fn: Function) {
        if (typeof fn !== "function") throw Error('ioEvent onUpdate prop needs to be of type Function')
        this._onUpdate = fn;
    }
}

