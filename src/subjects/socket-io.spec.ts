/**
 * Created by Mosh Mage on 12/17/2016.
 */
import {IO} from './socket-io';
import {ioEvent} from './io-events';
import {assign} from "rxjs/util/assign";
import * as io from 'socket.io';

function setUpTestServer() {
    return io.listen(1337).on('connection', (socket) => {
        socket.on('test-event',(socket)=> {
            socket.emit('test-event', {data: true});
        })
    });
}



describe('IO', () => {
    it ('is instance of itself', () => {
        let socket = new IO();
        expect(socket instanceof IO).toBe(true);
    });

    describe('listenEvent & eventExists', () => {
        let socket = new IO();
        let eventCount = 0;
        let event = new ioEvent({name: 'test-event', once: false, count: 0});

        it('event does not exist', () => {
            expect(socket.eventExists(event)).toBeFalsy();
        });

        it('it exists after being added', () => {
            eventCount = socket.listenToEvent(event);
            expect(socket.eventExists(event)).toBeTruthy();
            expect(eventCount).toBe(1);
        });

        it('listens because its unique', () => {
            let uniqueEvent = new ioEvent({name: 'test-event', once: true, count: 0});
            eventCount = socket.listenToEvent(uniqueEvent);
            expect(eventCount).toBe(2);
        });

        it('cant listen to a triggered unique', () => {
            let uniqueEvent = new ioEvent({name: 'test-event', once: true, count: 1});
            eventCount = socket.listenToEvent(uniqueEvent);
            expect(eventCount).toBe(2);
        });

    });
    
    describe('Public coverage', () => {

        it("raw", () => {
            let spySocket = new IO();
            expect(spySocket.raw).toBeFalsy();
            spyOn(spySocket, 'connected').and.returnValue(true);
            expect(spySocket.raw).toBeUndefined(); /** is undefined because .connect() wasn't issued */

        });

        it('socketState updating to true', () => {
            let spySocket = new IO();
            let event$ = spySocket.event$;
            spySocket.connected = true;

            event$.subscribe((newValue) => {
                expect(newValue).toEqual({connected: true});
            });
        });

        it ('SocketState updating to false', () => {
            let spySocket = new IO();
            let event$ = spySocket.event$;
            assign(spySocket, {
                _connected: true,
                socket: {disconnect() {}}
            });
            spyOn(spySocket.socket, 'disconnect').and.callThrough();

            event$.subscribe((newValue) => {
                expect({connected: false}).toEqual(newValue);
            }).unsubscribe();

            spySocket.connected = false;
        });

        it('Emit', () => {
            let spySocket = new IO();
            spySocket.connected = true;
            assign(spySocket, {socket: {emit() {}}});

            spyOn(spySocket.socket, 'emit').and.callThrough();

            spySocket.emit('test-event',{});
            expect(spySocket.socket.emit.calls.count()).toBe(1);

        });
    });

    describe('Connection', () => {
        let socket = new IO();
        setUpTestServer();

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