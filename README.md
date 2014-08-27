# FireBQ

## Intro
A queue system written in javascript for managing coordinated jobs flow, with
dashboard monitor.

It's been created using

*   firebase (for job storage)
*   neon.js
*   borium.js
*   elastic.js
*   widget.js

> Note:
> I'm using our set of our opensource inhouse tools, to get things working faster
> In particular I'm using [neon.js](http://azendal.github.io/neon/) which is just syntax sugar
> for creating oop like organization.
> Also the queue system is based on [borium](http://getborium.com/) which is our queue system
> I used the same API just rewrote the server and workers to use firebase as the
> data meeting point.

## Quick usage
clone the repo

```javascript
git clone git@github.com:escusado/quick-firebase-queue.git
```

install dependencies
```javascript
npm install
```

cd into theproject repo
```javascript
cd quick-firebase-queue
```

start the server
```javascript
node bin/server.js
```

point your browser
```
localhost:3000
```

Click the creation buttons

![](http://f.cl.ly/items/2t423b3d1I2s452k2l3j/Image%202014-08-27%20at%209.12.07%20AM.png)

Watch the characters been created by worker tasks:

![](http://f.cl.ly/items/2i3V3v2Q3Y0U2Q1x0q0F/Image%202014-08-27%20at%209.13.12%20AM.png)

---

## The Problem

Managing multiple tasks that manipulate data in order to compose a final output.
These tasks must be run in order, so the input data flows through a series of
data manipulation stages, resulting in a final composed set of data and
processes (over images, or video, or any external data).

And a way to monitor each state of the job, as many jobs are entering the system
all should be taken care of in order.
Each job type has a set of defined stages a dashboard must be implemented in
order to keep track of every job and its stages.

## Constraints

*   The system must be written in javascript and ran on node.js.
*   The system must use a worker based solution.
*   The system must use a job type system.
*   The job system must be capable of handling order by job-type (process stage name).
*   The job storage system must use firebase.

## Assumptions

<!-- *   The workers can be written in any language. (I'm **assuming python, ruby & javascript**). -->
*   The jobs can be described as json objects.
*   The jobs are a combination of:
    *   file manipulations (crud)
    *   database manipulation
    *   external services consumption (file uploading/downloading, external api call)
*   A job can have a state object.
*   The workers are by nature async.

## Functional Spec

### Theory of operation

The firebq queue system is written in javascript using borium.js spec as a guide
to implement a firebase based solution.

The system is composed by a server and clients scripts, the client can post jobs
to the manager to be taken care by an specific worker, this lets us queue different
type of workers to handle an specific state of the data.

### Components

#### The server

Firebq server (located at: `/bin/firebq`) it's a neon class script that starts a
nomal net socket for its IPC API so workers can be moved away to another machine.

Clients send their desired job in text form as:
```
jobName|"{data: stringified json state object}""
```

The server puts it in a firebase based storage, triggering a data change binding
that pulls new jobs and assigns the correct type of worker.

The server looks every time for `'wating'` state, and executes the correct worker for it
and pass the state object in a piped fashion ([this is happening here](https://github.com/escusado/quick-firebase-queue/blob/ui/bin/firebq/FirebqServer.js#L66));

#### The workers

> The case study workers are located at /bin/characterCreator/workers
> Note:
> For this particular case, I found easies to make the workers act directly into the
> character data storage, this triggers the natural firebase binding cycle, that
> the `character creator app` is already binded to.

A worker is a command-callable script that can receive piped json data in string
form ([here](https://github.com/escusado/quick-firebase-queue/blob/ui/bin/characterCreator/index.js#L94)).

It must process and executes its job and then exit gracefully so the server can know
when te task has ended.

---
# Proposed study case

Imaginary RPG style game, that needs some procedural character creation.

For this example we need to create 2 types of characters:
*   Hero
*   Enemy

A hero is defined when it has all these stats
*   Name (get from web service)
*   Age  (assign random based on 'hero' or 'enemy' type)
*   Portrait (get an image from web service)
*   Class (random 'Warrior', 'Mage', 'Thief')
*   Stats (assign based on Class type)
   *   hp
   *   str
   *   agi

An enemy is defined by these stats:
*   Class (random 'zombie', 'ogre', 'dragon')
*   Portrait (get an image from web service)
*   Stats (assign based on Class type)
   *   hp

The final output will be a list of heroes and enemies with their calculated data
assigned.

## Character creator abstract

The idea behind the excercise is to create a worker for each type of stat to calculate.
As some of them depend on previous calculations they must be run in order.

The interaction with the system will be throuhg a simple web-interface that will let
*   Create heroes or enemies
*   Monitor the creation status

# Character Creator Functional Spec

Our simple character creator runs a simple web interface to send character
creation requests and to monitor de sequential stages for each stat.

![](http://f.cl.ly/items/1r1n041O3T081D0y1D0s/Image%202014-08-26%20at%209.10.00%20AM.png)

The buttons at the top, will trigger the creation process, each stat will be grayed
out until its calculated, this will help to monitor at which state is each character

## Components & theory of operation.


### The web-app

I'm using our in-house toolset to create the front-end character monitor, it's a
mix of express, socket.io, and some front-end logic to tie them toghether (through socket.io)

Anyway the web app streams the creation request through a web-socket to the express app,
the web server, has an instance of `CharacterCreator` app, that receives this command, as a `type`
string of the desired type of character.

An empty object defining the character structure is created and stored in a firebase
databse (because why not ha) ([here](https://github.com/escusado/quick-firebase-queue/blob/ui/bin/characterCreator/index.js#L67)) and given a status
of pending creation, this is used to know when a character has been completed by its workers.

The app is hooked to a socket event called `character:data` that is fired by the
`characterCreator` instance every time data is updated in the firebase storage, displaying
all changes on a single character, and updating ui in real time.

### CharacterCreator
The character creator app is a simple storage, and data manipulation script, that
handles character types defined as `json` data and pass this data structure through
a set of jobs to be manipulated (add data, update data, etc.).

The character creator can hold any type of character that has a `meta`, `portrait`,
`stats` inside a `data` index they are added using the `addCharacterType` api call.

Also a character has their own creation process defined in the `jobs` array, this one
holds which jobs and in which order they must be executed:

```javascript
    this._addCharacterType({
        jobs : ['addName', 'addStats'],

        data : {
            id: null,
            meta:{
                charType: 'enemy',
                class : 'warrior'
            },
            portrait : null,
            stats:{
                hp: 50,
                str: 50
            }
        }
    });
```

In this paricular case, the data structure will be passed to the 'addName' worker first
then to the `addStats` one in that order, until no more jobs are stored there (which would be the `complete` state).

Workers are defined here at server instantiation, in this case in the firebq wrapper ([here](https://github.com/escusado/quick-firebase-queue/blob/ui/bin/firebq/index.js#L25))

So then we have full circle, the character can have all the scripts for him.




