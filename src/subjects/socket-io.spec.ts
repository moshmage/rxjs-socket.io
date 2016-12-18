/**
 * Created by Mosh Mage on 12/17/2016.
 */
import {IO} from './socket-io';
import {ioEvent} from './io-events';
import {initialState} from "./../interfaces/socket-io";


describe('IO', () => {
    let socket = new IO();

    it ('is instance of itself', () => {
        expect(socket instanceof IO).toBe(true);
    });

    it('initialValues are set', () => {
        expect(socket.socketState.connected).toBe(false);
    });

    describe('listenEvent & eventExists', () => {
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
        it('socketState', () => {
            expect(socket.socketState).toEqual(initialState);
        });

        it("raw", () => {
            let spySocket = new IO();
            expect(socket.raw).toBeFalsy();
            spyOn(spySocket, 'connected').and.returnValue(true);
            expect(spySocket.raw).toBeUndefined(); /** is undefined because .connect() wasn't issued */
        });

        it('socketState updating', () => {
            let event$ = socket.event$;
            let subscription = event$.subscribe((newValue) => {
                /** I'm not reeeeaally sure this is how you test this. */
                expect(newValue).toEqual({connected: false});
            });
            socket.connected = false;
            subscription.unsubscribe();
        });
    });
});