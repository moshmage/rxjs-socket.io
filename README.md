# RxJs Socket.IO <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="build status" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/build.svg" /></a> <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="coverage report" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/coverage.svg" /></a>
install with `npm install --save rxjs-socket.io`

## Quick Start
```typescript
import {IO, ioEvent} from 'rxjs-socket.io'
import {Subscription} from 'rxjs/Subscription';

const socket = new IO();
const onHelloWorld: ioEvent = new ioEvent("hello-world", false, 0);
const helloWorld$: Subscription;

this.helloWorld$ = this.socket.listenToEvent(this.onHelloWorld)
.event$.subscribe((newState) => this.state = newState);

this.socket.connect('http://localhost:5000');
```

## Documentation


### Examples
For examples, check the [example repo](https://gitlab.com/moshmage/rxjs-sioc-eample)

##### Todo
- ~~Unit testing~~
- ~~Example~~
- ~~Docs~~
- ~~Proper Documentation~~
- Can I get a code review? That'd be neat.
- ~~Publish~~