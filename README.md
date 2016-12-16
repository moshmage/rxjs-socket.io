###### Created by Mosh Mage on 12/15/2016.
### Thanks to
- http://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924
- http://www.syntaxsuccess.com/viewarticle/socket.io-with-rxjs-in-angular-2.0

### Why
Main objective was to have a "more than one event" subscription so I could listen to more than one event, as my
whole application is not on a `message` event. That'd be wack.

### How
To do this, I applied RxJs Subject Behavior on a SocketIO wrapper Class that's fed an array of instaces of `ioEvents`;
Each ioEvent is responsible for itself, that's to say that an ioEvent is the one that issues a `.next()` update on the `Subject`.

You can, and are supposed to, `extend` on the `ioEvent` Class - treat this as you would behaviors, because that's all they are. You can `extends ioEvent` and then use `this.onUpdate = (newData) => {}` to run some function *after* the update has been ran on its `ioEvent.updateData` counterpart.

### All in all
RxJs is indeed useful, besides fun. and you can "see" the EventEmitter base in it which kinda helps understand the "Subject" of it all.

###### pet peeves
I decided against using "Observables" as "Subjects" [*already are*](http://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2/35568924#35568924)...
> Observable (so we can subscribe() to it) and an Observer (so we can call next() on it to emit a new value).

^(I'm still working on documentation and such, the source is heavily descriptive: go read that instead.)

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
- Example
- Publish
- Can I get a code review? That'd be neat.
