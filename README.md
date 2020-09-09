# RxJs Socket.IO <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="build status" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/pipeline.svg" /></a> <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="coverage report" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/coverage.svg" /></a>
install with `npm install --save rxjs-socket.io`
## Quick Start
```typescript
import {IO} from 'rxjs-socket.io'
const Socket = new IO();

const {helloWorld$, dondeEsLaBiblioteca$} = this.socket.listen([
  'hello-world',
  {name: 'where-is-the-library', once: true, initialState: 'not-found'},
]);

helloWorld$.subscribe(newState => console.debug('helloWorld$',newState));
dondeEsLaBiblioteca$.subscribe(newState => console.debug('dondeEsLaBiblioteca$',newState));

Socket.connect('http://localhost:5000');
```

## What? Why?!
rxjs-socket.io was made to wrap RxJs and Socket.IO onto a standardized api of sorts. It achieves this by storing
the Events you feed it between connections, in memory. This is made so you only need to create the subscriptions
once and from then on your events can be subscribed to, unsusbcribed or turned off when the need arises.

The core idea is that we separate events and connection into two different steps; We create and feed events to an
array that will be then looped when the socket connects and have the population of the array fed in turn to socket.io.
It will turn the raw event callback from socket.io onto a `ioEvent` Class which owns a RxJs ReplaySubject proprety 
that you can then control, along with information about the event.

Check the [IO Class](https://moshmage.gitlab.io/rxjs-socket.io/classes/_subjects_socket_io_.io.html) and [ioEvent](https://moshmage.gitlab.io/rxjs-socket.io/classes/_subjects_io_events_.ioevent.html) for 
in depth understanding of the methods.


### Default usage
```typescript
import {IO, ioEvent} from 'rxjs-socket.io'
import {Subscription} from 'rxjs/Subscription';

/** create a new pointer to the SocketIO wrapper */
const socket = new IO();

/** create a new Event which will be pushed into @socket on connection */
const onHelloWorld: ioEvent = new ioEvent("hello-world");

/** since ioEvent returns an observable in one of its props, lets go ahead and define a subscription*/
let helloWorld$: Subscription;
let state;

/** tell socket io to listen to the hello world event and subscribe to the result */
helloWorld$ = socket.listenToEvent(onHelloWorld)
.event$.subscribe((newState) => state = newState);

/** the hello world event we just created will be pushed once the connection is established */
socket.connect('http://localhost:5000');
```

### Unusual usages

```typescript
let _eventData: any;
get state(): any { return this._eventData };

/** This function will be ran **after** the `.next()` update */
onHelloWorld.onUpdate = (newState) => this._eventData = newState;
socket.listenToEvent(onHelloWorld);
```

```typescript
onHelloWorld.initialState = 1; // 1;
onHelloWorld.initialState = {world: '1'}; // {world: '1'}
onHelloWorld.initialState = {area: '2'}; // {wordl: '1', area: '2'}
```

```typescript
const onHelloWorld = new ioEvent('hello-world');

const checkLastEvent = () => console.log(onHelloWorld.lastEvent);

const helloWorld$ = this.socket.listenToEvent(onHelloWorld)
    .event$.suscribe(checkLastEvent);
```

There's a [typings](https://gitlab.com/moshmage/rxjs-socket.io/wikis/rxjs-socket.io.d.ts)
wiki and a typedoc generated [documentation](https://moshmage.gitlab.io/rxjs-socket.io/).
Anything else, the code is pretty verbose. Go ahead and dive in :)