# RxJs Socket.IO
<a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="build status" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/build.svg" /></a> <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="coverage report" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/coverage.svg" /></a>

## Install, Docs and Future
Read the [project wiki](https://gitlab.com/moshmage/rxjs-socket.io/wikis/home)

### Why
Main objective was to have a "more than one event" subscription so I could listen to more than one event, as my
whole application is not on a `message` event. That'd be wack.

### How
To do this, I applied RxJs Subject Behavior on a SocketIO wrapper Class that's fed an array of instaces of `ioEvents`;    
Each ioEvent is responsible for itself, that's to say that an ioEvent is the one that issues a `.next()` update on the `Subject`.

You can, and are supposed to, `extend` on the `ioEvent` Class - treat this as you would behaviors, because that's all they are.    
Then, `extends ioEvent` and after, `this.onUpdate = (newData) => {}` to run some function *after* the update has been ran on its `ioEvent.updateData` counterpart.
