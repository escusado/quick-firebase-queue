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

Watch the characters been created
![](http://f.cl.ly/items/2i3V3v2Q3Y0U2Q1x0q0F/Image%202014-08-27%20at%209.13.12%20AM.png)

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
   *   int

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

The web app is defined