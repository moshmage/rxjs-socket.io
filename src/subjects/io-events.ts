import {IoEventInfo} from '../interfaces/socket-io';
import {Subject} from 'rxjs';

export class ioEvent<T = any> {
    /** this is the reference for a io() value */
    private clientSocket: any;

    /** the actual Rx Subject */
    private _lastEvent = new Subject<T>();


    /** a reference to the last received event */
    public lastEvent: T;

    /**
     * Responsible for eventCounting and updating data on the ReplaySubject
     * if _onUpdate exists, it will be called with newData as argument
     * @param newData
     */
    private updateData(newData: T) {
        this._lastEvent.next(newData);
        this.event.count++; /** we will be using "count" has a way of knowing if it has been triggered. */
        if (this._onUpdate) this._onUpdate(newData); /** a way for us to extend properly */
        this.lastEvent = newData;
    }
    private _onUpdate: Function;

    /**
     * Event information
     * @type {IoEventInfo}
     */
    public event: IoEventInfo = {name: '', count: 0, once: false};
    constructor(name: string, isUnique?:boolean, count?:number, initialState?:string|Object) {
        this.event.name = name;
        if (count) this.event.count = count;
        if (isUnique !== undefined) this.event.once = isUnique;
        if (initialState) this.initialState = initialState;
        this.clientSocket = false;
    }

    /**
     * The Subscribable (Observable) prop
     * subscribe to this prop to be notified of data update
     *
     * @usage
     *
     * ```
     * const event = new ioEvent('event');
     * const event$ = event.$event.subscribe(() => {});
     * ```
     */
    public event$ = this._lastEvent.asObservable();

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

    /** a callback that should be ran on every state update */
    public get onUpdate() {return this._onUpdate;}

    /**
     * hook() is an alias to `socket.on()` or `socket.once()` depending on the provided `IoEventInfo`
     * provide a socket-io client socket so the ioEvent can make the hook. It will use that socket
     * from there on, unless @this.clientSocket is not the same as the provided one: Then it will re-hook
     * *without calling unhook*
     * @param clientSocket {Socket}
     */
    public hook(clientSocket) :void {
        this.clientSocket = this.clientSocket || clientSocket;
        if (clientSocket && this.clientSocket !== clientSocket) this.clientSocket = clientSocket;
        if (!this.clientSocket) throw Error('ioEvent has no socket to hook to.');

        if (this.event.once) {
            this.event.count = 0;
            this.clientSocket.once(this.event.name, (data) => this.updateData(data));
            return;
        }

        this.clientSocket.on(this.event.name, (data) => this.updateData(data));
    }

    /** unhook is an alias for "off", and since we only have one real callback attached to the Emitter
     * we don't need to pass a `fn` argument */
    public unhook() :void {
        if (this.event.once) return;
        this.clientSocket.off(this.event.name);
    }

    /**
     * Set this to a function value if you want something to run *after*
     * the value has been updated.
     * @param fn {Function}
     */
    public set onUpdate(fn: Function) {
        if (typeof fn !== "function") throw Error('ioEvent onUpdate prop needs to be of type Function');
        this._onUpdate = fn;
    }

    private _initialState: any = undefined;
    public get initialState(): string|Object {return this._initialState;}

    /**
     * Use this to set an initialState to be reset to when connection closes
     * otherwise, false will be the updating value. If your initialState is
     * set an as Object, the new state will be `Object.assign`ed.
     * @param state {any}
     */
    public set initialState(state: string|Object) {
        if (!this._initialState) this._initialState = state;
        else if (typeof this._initialState === 'object' && !Array.isArray(this._initialState)) this._initialState = Object.assign(this._initialState, state);
        else this._initialState = state;
    }

    /**
     * Reset state updates the ReplaySubject with the initialState;
     * If none exists, `false` is used as default
     */
    public resetState() {
        this.updateData(this._initialState);
    }
}

