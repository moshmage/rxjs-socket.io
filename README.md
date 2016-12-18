### Why
Main objective was to have a "more than one event" subscription so I could listen to more than one event, as my
whole application is not on a `message` event. That'd be wack.

### How
To do this, I applied RxJs Subject Behavior on a SocketIO wrapper Class that's fed an array of instaces of `ioEvents`;    
Each ioEvent is responsible for itself, that's to say that an ioEvent is the one that issues a `.next()` update on the `Subject`.

You can, and are supposed to, `extend` on the `ioEvent` Class - treat this as you would behaviors, because that's all they are.    
Then, `extends ioEvent` and after, `this.onUpdate = (newData) => {}` to run some function *after* the update has been ran on its `ioEvent.updateData` counterpart.

### Documentation 
For now, [check the *.d.ts](rxjs-socket.io.d.ts) of the files, as the source is heavily commented;    
When I get a typescript docs generator to run properly without barfing errors about typings, I'll make a proper gl-page. You can help with that if you want to :)

#### While we haven't published you can:
^(This will install the module as a local thingy. You'll have to manually `git pull` every once in a while to get them updates.)
- `git clone` the source to a folder of your choosing
- `cd to/that/folder` and issue `npm install`
- link it good with `npm link`
- `cd ..` ouf of there and `cd you/awesome/project`
- issue `npm link rxjs-socket.io`

#### Todo
- Testing
- Docx
- ~~Example~~ there's *one* [Angular2]() example
- Publish
- Can I get a code review? That'd be neat.

---

### Thanks to
- http://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924
- http://www.syntaxsuccess.com/viewarticle/socket.io-with-rxjs-in-angular-2.0
- ### All in all
RxJs is indeed useful, besides fun. and you can "see" the EventEmitter base in it which kinda helps understand the "Subject" of it all.

###### pet peeves
I decided against using "Observables" as "Subjects" [*already are*](http://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924)...
> Observable (so we can subscribe() to it) and an Observer (so we can call next() on it to emit a new value).
