/**
 * Created by Mosh Mage on 12/17/2016.
 */
import {IO} from './subjects/socket-io';
import {ioEvent} from './subjects/io-events';

// @ts-ignore

describe('IO', () => {
    it ('is instance of itself', () => {
        let socket = new IO();
        expect(socket instanceof IO).toBe(true);
    });
    describe('listenEvent & eventExists', () => {
        const socket = new IO();
        const eventCount = 0;
        const event = new ioEvent('test-event');
        const uniqueEvent = new ioEvent('test-event', true);

        it('event does not exist', () => {
            const newEvent = new ioEvent('new-event');
            expect(socket.eventExists(newEvent)).toBeFalsy();
        });

        it('it returns the same event, because it already exists', () => {
            const sameEvent = socket.listenToEvent(event);
            expect(event).toEqual(sameEvent);
            expect(socket.eventExists(event)).toBeTruthy();
        });

        it('listens because its unique', () => {
            const uniqueHook = socket.listenToEvent(uniqueEvent);
            expect(uniqueEvent).toBe(uniqueHook);
        });

        it('returns the same unique event', () => {
            const uniqueHook = socket.listenToEvent(uniqueEvent);
            const [anotherUniqueListen] = socket.listen([uniqueEvent]);
            expect(anotherUniqueListen).toEqual(uniqueHook.event$);
        });

    });
    describe('Public coverage', () => {

        it("raw", () => {
            const spySocket = new IO();
            expect(spySocket.raw).toBeFalsy();
            // @ts-ignore
            spyOn(spySocket, 'connected').and.returnValue(true);
            expect(spySocket.raw).toBeUndefined(); /** is undefined because .connect() wasn't issued */

        });

        it('socketState updating to true', () => {
            const spySocket = new IO();
            const event$ = spySocket.event$;
            spySocket.connected = true;

            event$.subscribe((newValue) => {
                expect(newValue).toEqual({connected: true});
            });
        });

        it ('SocketState updating to false', () => {
            const spySocket = new IO();
            const event$ = spySocket.event$;
            Object.assign(spySocket, {
                _connected: true,
                socket: {disconnect() {}}
            });
            spyOn((spySocket as any).socket, 'disconnect').and.callThrough();

            event$.subscribe((newValue) => {
                expect({connected: false}).toEqual(newValue);
            }).unsubscribe();

            spySocket.connected = false;
        });

        it('Emit', () => {
            const spySocket = new IO();
            spySocket.connected = true;
            Object.assign(spySocket, {socket: {emit() {}}});

            spyOn((spySocket as any).socket, 'emit').and.callThrough();

            spySocket.emit('test-event',{});
            expect((spySocket as any).socket.emit.calls.count()).toBe(1);

        });
    });

    xdescribe('Connection', () => {

        // function setUpTestServer() {
        //     return require('socket.io').listen(1337).on('connection', (socket) => {
        //         socket.on('test-event',(socket)=> {
        //             socket.emit('test-event', {data: true});
        //         })
        //     });
        // }

        let socket = new IO();
        // setUpTestServer();

        it('connects', () => {
            console.log('testing connects');
            socket.event$.subscribe((newData)=>{
                console.log('newData', newData);
                expect(newData).toContain({connected: true})
            }).unsubscribe();
            socket.connect('localhost:1337');
        });
    })
});

describe('ioEvent', () => {
    const socket = new IO();
    const eventCount = 0;
    let event;
    describe('Public coverage', () => {
        beforeEach(() => {
            event = new ioEvent('test-event');
            Object.assign(event, {clientSocket: {once() {}, on() {}, off() {} }})
        });

        it('hooks, once', () => {
            event.event.once = true;
            spyOn(event.clientSocket, 'once').and.callThrough();
            event.hook(event.clientSocket);
            expect(event.clientSocket.once.calls.count()).toBe(1);
        });

        it('hooks using on', () => {
            spyOn(event.clientSocket, 'on').and.callThrough();
            event.hook(event.clientSocket);
            expect(event.clientSocket.on.calls.count()).toBe(1);
        });

        it('hooks using on with a new socket', () => {
            let newClientSocket = {clientSocket: {once() {}, on() {}, off() {}, id: 1}};
            spyOn(newClientSocket.clientSocket, 'on').and.callThrough();
            spyOn(event.clientSocket, 'on').and.callThrough();

            event.hook(event.clientSocket);
            event.hook(newClientSocket.clientSocket);

            expect(event.clientSocket.on.calls.count()).toBe(1);
            expect((newClientSocket.clientSocket.on as any).calls.count()).toBe(1);
        });

        it('does not unhook because once', () => {
            event.event.once = true;
            spyOn(event.clientSocket, 'off').and.callThrough();
            event.unhook();
            expect(event.clientSocket.off.calls.count()).toBe(0);
        });

        it('does unhook', () => {
            spyOn(event.clientSocket, 'off').and.callThrough();
            event.unhook();
            expect(event.clientSocket.off.calls.count()).toBe(1);
        });

        it('sets a callback function', () => {
            /** check the "throw" further down for its counter */
            let noop = () => {};
            event.onUpdate = noop;
            expect(event.onUpdate).toBe(noop);
        });

        describe('initialState', () => {
            it ('is undefined', () => {
                expect(event.initialState).toBe(undefined);
            });

            it('is assignable and object', () => {
                event.initialState = {hello: 'world'};
                event.initialState = {world: 'hello'};
                expect(event.initialState).toEqual({hello: 'world', world: 'hello'});
            });

            it('is assignable and not a object, so rewritten', () => {
                event.initialState = 'hello';
                expect(event.initialState).toEqual('hello');
            });

            it('resets state (and cover onUpdateData on the way)', () => {
                const noop = () => {};
                event.onUpdate = noop;
                event.resetState();
                expect(event.initialState).toBe(undefined);
            })
        })
    });

    describe('throws', () => {
        it('Should throw because a socketClient wasnt provided', () => {
            event = new ioEvent('test-event');
            expect(function () {
                return event.hook()
            }).toThrowError(/no socket/i);
        });

        it ('should throw because provided is not a function', () => {
            event = new ioEvent('test-event', false, 0);
            expect(function () {
                return event.onUpdate = '';
            }).toThrowError(/type Function/i);
        });
    })
});
