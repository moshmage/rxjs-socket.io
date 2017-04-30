# RxJs Socket.IO <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="build status" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/build.svg" /></a> <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="coverage report" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/coverage.svg" /></a>
install with `npm install --save rxjs-socket.io`

## Default usage
```typescript
import {IO, ioEvent} from 'rxjs-socket.io'
import {Subscription} from 'rxjs/Subscription';

/** create a new pointer to the SocketIO wrapper */
const socket = new IO();

/** create a new Event which will be pushed into @socket on connection */
const onHelloWorld: ioEvent = new ioEvent("hello-world");

/** since ioEvent returns an observable in one of its props, lets go ahead and define a subscription*/
let helloWorld$: Subscription;

/** tell socket io to listen to the hello world event and subscribe to the result */
helloWorld$ = this.socket.listenToEvent(onHelloWorld)
.event$.subscribe((newState) => this.state = newState);

/** the hello world event we just created will be pushed once the connection is established */
socket.connect('http://localhost:5000');
```

#### What and Why
rxjs-socket.io is a wrapper and a moduler around socket.io and rxjs.
It was made because I was tired of having to write an "event moduler" over and over again whenever I start a new project.    
I decided I'd write one that would fit all my future projects, while reaching a standard of sorts while I'm at it. 

The [`IO`](https://moshmage.gitlab.io/rxjs-socket.io/classes/_subjects_socket_io_.io.html) Class will be responsible by storing which events you want to be subscribed to and update them through 
`next` when those are triggered. Since we store the events into memory, when you disconnect and reconnect there's 
no need to make a new event.

These events are created via the [`ioEvent`](https://moshmage.gitlab.io/rxjs-socket.io/classes/_subjects_io_events_.ioevent.html) Class and pushed via [`IO.listenToEvent`](https://moshmage.gitlab.io/rxjs-socket.io/classes/_subjects_socket_io_.io.html#listentoevent). `ioEvents` can have the
same name but are always unique. That is, even you construct 2 ioEvents with the same name and made `IO.listenToEvent()`
**only one of those** would be pushed into the listening queue. Since we are using subscriptions, there's no need to
have two events for different situations; Just have the components be responsible for the handling of the event result.

When you issue `IO.connect()`, the `ioEvent`s you did push to the listening queue will be heard via socket.io methods 
`on` or `once` depending on if you made it a unique event or not.

#### Unusual usages

```typescript
let _eventData: any;
get state(): any { return this._eventData };

this.socket.unhook('hello-world');
this.helloWorld$.unsubscribe();

this.onHelloWorld.onUpdate = (newState) => this._eventData = newState;
this.socket.listenToEvent(this.onHelloWorld);
```

```typescript
this.onHelloWorld.initialState = 1; // 1;
this.onHelloWorld.initialState = {world: '1'}; // {world: '1'}
this.onHelloWorld.initialState = {area: '2'}; // {wordl: '1', area: '2'}
```

```typescript
const onHelloWorld = new ioEvent('hello-world');

const checkLastEvent = () => console.log(onHelloWorld.lastEvent);

const helloWorld$ = this.socket.listenToEvent(onHelloWorld)
    .event$.suscribe(checkLastEvent);
```

There's a [typings](https://gitlab.com/moshmage/rxjs-socket.io/wikis/rxjs-socket.io.d.ts)
filter and a typedoc generated [documentation](https://moshmage.gitlab.io/rxjs-socket.io/).
Anything else, the code is pretty verbose. Go ahead and dive :)