# RxJs Socket.IO
<a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="build status" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/build.svg" /></a> <a href="https://gitlab.com/moshmage/rxjs-socket.io/commits/master"><img alt="coverage report" src="https://gitlab.com/moshmage/rxjs-socket.io/badges/master/coverage.svg" /></a>

## Install, Docs and Future
Read the [project wiki](https://gitlab.com/moshmage/rxjs-socket.io/wikis/home)

### Why
Main objective was to have a "more than one event" subscription so I could listen to more than one event, as my
whole application is not on a `message` event. That'd be wack.

### How
rxjs-socket.io exposes two classes, `IO` (which can be used as a provider @ Angular2) and `ioEvent`. IO Class is responsible to listen to `ioEvent`s.    
IO then creates a `ReplaySubject` which will make a `EventListener` reference to socket.io, which will fire the corresponding `ReplaySubject` that's exposed by `ioEvent` as well.

All you need to do is create `ioEvent`s and tell `IO` to `listenToEvent(ioEvent)`, followed by a RxJs Subscription to the exposed `event$` prop.    
There's a heavily documented @angular2 [exmaple on the wiki](heavy-commented-@angular-example)

---

#### Thanks to

- http://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924
- http://www.syntaxsuccess.com/viewarticle/socket.io-with-rxjs-in-angular-2.0 ^(this is where the need arised from)

###### pet peeves

I decided against using "Observables" as "Subjects" [already are...](http://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924)

> Observable (so we can subscribe() to it) and an Observer (so we can call next() on it to emit a new value).
