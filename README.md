### Why
Main objective was to have a "more than one event" subscription so I could listen to more than one event, as my
whole application is not on a `message` event. That'd be wack.

### How
To do this, I applied RxJs Subject Behavior on a SocketIO wrapper Class that's fed an array of instaces of `ioEvents`;    
Each ioEvent is responsible for itself, that's to say that an ioEvent is the one that issues a `.next()` update on the `Subject`.

You can, and are supposed to, `extend` on the `ioEvent` Class - treat this as you would behaviors, because that's all they are.    
Then, `extends ioEvent` and after, `this.onUpdate = (newData) => {}` to run some function *after* the update has been ran on its `ioEvent.updateData` counterpart.

#### Install, Docs and Future
Read the [project wiki](https://gitlab.com/moshmage/rxjs-socket.io/wikis/home)

---

### Thanks to
- http://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924
- http://www.syntaxsuccess.com/viewarticle/socket.io-with-rxjs-in-angular-2.0

###### pet peeves
I decided against using "Observables" as "Subjects" [*already are*](http://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924)...
> Observable (so we can subscribe() to it) and an Observer (so we can call next() on it to emit a new value).
