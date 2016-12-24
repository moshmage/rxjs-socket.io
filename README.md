# RxJs Socket.IO <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="build status" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/build.svg" /></a> <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="coverage report" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/coverage.svg" /></a>
install with `npm install --save rxjs-socket.io`

## Usage
```typescript
import {IO, ioEvent} from 'rxjs-socket.io'

const socket = new IO();
let onHelloWorld = new ioEvent("hello-world", false, 0);

onHelloWorld = socket.listenToEvent(onHelloWorld);
socket.connect('http://localhost:1337');

onHelloWorld.event$.subscribe((state) => {
    console.log('new state', state);
});
```

## Documentation
For now, [check the *.d.ts](rxjs-socket.io.d.ts) of the files, as the source is heavily commented;
When I get a typescript docs generator to run properly without barfing errors about typings, I'll make a proper gl-page. You can help with that if you want to :)

### Examples
For examples, check the [example repo](https://gitlab.com/moshmage/rxjs-sioc-eample)

##### Todo
- ~~Unit testing~~
- ~~Example~~
- ~~Docs~~
- Proper Documentation
- Can I get a code review? That'd be neat.
- ~~Publish~~