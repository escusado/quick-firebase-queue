# Firebq

A simple job queue manager for firebase based workers.

## Abstract

A simple javascript/node job queue for firebase based data workers.

## Quick usage

1. Clone the repo & isntall dependencies:

```
git clone: git@github.com:escusado/quick-firebase-queue.git
cd quick-firebase-queue
npm install
```

2. Config the firebq data storage [here](https://github.com/escusado/quick-firebase-queue/blob/master/bin/firebq/index.js#L6)
3. Configure the Drone-Simulator client data storage [here](https://github.com/escusado/quick-firebase-queue/blob/master/assets/js/DroneSimulator/Map.js#L18)
(emtpy firebase databases are ok)

4. Start the firebq server
```
node bin/firebq
```

5. Start the Drone Simulator web-app
```
node bin/server.js
```

### Constraints

*   The queue should use firebase as its job storage
*   The jobs can be difreren type
*   The workers must process data stores in firebase aswell

### Assumptions

*   As the worker is processing firebase data, _it will do that_, so all the connection and processing logic is up to the worker itself

## Functional Spec

The job queue is handled by a server, this server receives job processing requests in text format.
The job is stored and processed when the associated worker gets free.

## Theory of Operation

```
firebq
+------------------------------------------------+
|firebase storage                                |
+------------------------------------------------+
|"workerScript.js:firebase-dataset-id-xxxx"      |
|"anotherWorkerScript.js:firebase-dataset-id-xxx |
| ...                                            |
+--+---------------------------------------------+
   |
   |
+--v--------------------------+
|workers pool                 |
| +------+  +------+ +------+ |
| |Worker|  |Worker| |...   | |
| +---+--+  +--+---+ +------+ |
+-----|--------|--------------+
      |        |
      |        +-----------------+
      |                          |
      |                          |
+-----|--------------------------|------------+
| +---v-----------+  +-----------v----------+ |
| |workerScript.js|  |anotherWorkerScript.js| |
| +---------------+  +----------------------+ |
| /workerScripts                              |
+---------------------------------------------+

```

The firebq server, takes commands in the following format:

```
workerSctipt.js:firebase-data-set-id
```

The server will take the first part and will try to execute the script using a `Worker` instance.
The worker will fin the script on the `/workerScripts` folder, and will output as an [event](https://github.com/escusado/quick-firebase-queue/blob/master/bin/firebq/Worker.js#L33).
The server will catch the completion event for the worker and send the output as an `job:done` or `job:error`, through the socket.


## Components

Firebq stores its jobs in text format, that holds the script to execute and the dataset id that will be passed to it.
The firebq server has a `worker pool` that contains n Worker class instances.
The `/workerScripts` folder contains all the job type scripts for the worker to load and execute.
When the program finishes it reports the job status back to the firebqu server.

### firebq Server

The main server app, when the server is started it creates all the necesary workers and start the firebase database,
it will start a socket server (using ![postal.js](https://github.com/postaljs/postal.js) for socket management).


#### API
The server will listen a socket `queue` call

*   `name: 'enque:job', data: 'workerScript.js:firebase-dataset-id'`
   *   this event call the job storing logic to the firebase storage

The socket server will emit the result

*   `name: 'job:done' data: 'firebq-job-id'`
   *   this event triggers the job done logic, releasing the job and freeing the worker
*   `name: job:error, data: 'firebase-dataset-id-xxxx'
   *   This event is triggered when the worker couldn't run the job and failed on execution.

The server api works over a net socket, so jobs can be enqueued remotely or locally.

### firebq client

A client js library to make queue jobs easy, and handling the results based on events.
The client handles the queue and event firing for the job complete status.

#### API

The client API is really simple

`firebaseCli.queue('scriptForWorker.js:firebase-dataset-id')`
This queues a job on the server.

`firebaseCli.bind('job:done', 'firebase-dataset-id');`
The `job:done` event is fired each time a job finishes without errors

`firebaseCli.bind('job:error', {data: 'firebase-dataset-id', error: error-object});`
The `job:error` event fires each time a worker fails to finish

---
# A services that consumes jobs in a queue

## The idea

A Drone simulator, that displays a grid divided map, and drones taking pictures
of each cell on the map.

![Drone sim](http://f.cl.ly/items/1C2B1S2I280E0N0W1s02/Screen%20Shot%202014-08-31%20at%205.36.30%20PM.png)

### How it works

*   A map is created using the Map class (can be configured [here](https://github.com/escusado/quick-firebase-queue/blob/master/assets/js/DroneSimulator/Map.js#L7)).
*   A set of drone stations are placed next to the map (the number of station can be configured [here](https://github.com/escusado/quick-firebase-queue/blob/master/assets/js/DroneSimulator/DroneSimulator.js#L16-17))
*   A controller assign a set of unasigned map cells to each drone station.
*   The station deploys the drone with all the targets for picture taking.
*   The drone does its job cell map by cell map (the quantity of pictures per drone can be configured here: TODO)
*   The drone returns to its station to deliver the imagery payload.
*   The station receives the imagery data and sends it to the app backend for processing
*   The app backend holds a list of all the processes the images has to go trhough.
*   The app backend takes each image and queues each process in order.

*   `firebq` queue receives the worker path and the firebase dataset id
*   The javascript workers receive the id of the dataset they need to process
*   Each worker knows what to do with the data, when done, they send a `job:done` event to `firebq`
*   `firebq` removes the job from the queue

*   The map data on the drone-simulator will be updated real-time (thanks firebase)
*   As data is been added to each cell, the map will be updating on real time.

*   There are 3 stages for each image
   *   Add sattelite image
   *   Add a fake heatmap image
   *   Add a fake could point like data image


---
# Requirements:

*   **correctness - The code should perform as specified, edge cases and errors should be handled.**
   *   The queue considers workers failing, and report for the error is added if the worker had one.
*   **style - The code should be well written and easy to understand, comments should be added where necessary.**
   *   Well thats for you to decide :). But the same logic and style is followed on front and back.
*   **tests - It would be great if there were some test coverage of core logic.**
   *   The drone-simulator, uses all the `firebq` features:
      *   job queuing
      *   job succes handling
      *   job error handling

---

*   **Design a service using Firebase & node.js that can consume jobs in a queue for processing.**
   *   [Firebq](https://github.com/escusado/quick-firebase-queue/tree/visualsim#firebq) is a job queue that holds jobs for firebase based workers.
*   **Use Firebase for the datastore where the queue and actual processed data should live.**
   *   The firebq and the [drone-simulator](https://github.com/escusado/quick-firebase-queue/tree/visualsim#the-idea) storage are on firebase.
*   **Imagine a service which reads items from a queue, which contain data to indicate what kind of processing they require, that service should then dispatch those queued jobs to workers for processing.**
   *   The Drone simulator app; displays a map and drones gathering data from it, the simulated data analisys happens on independent workers that manipulate the data directly. These workers are executed by `firebq` queue.
*   **You can simulate the processing by using a timeout and updating a value to emulate a process that takes a bit of time and has an effect.**
   *   The async logic in each worker is simulated this way.
*   **It would also be great to have a dashboard that shows in real-time the states of the queue and the processing.**
   *   The web app on  `localhost:3000/`, displays the worker queue status.

## Once complete, you should have the following:

*   **a node.js process that you can start which would initiate listening for new items in the queue.**

```
node bin/firebq
```

*   **a script to simulate pushing a new job to the queue**

```
node bin/server.js
```

point your browser to:

```
http://localhost:3000/
```

Click Launch.

> optional:
> Configure the simluator app, before loading the page (see config points avobe).

*   **a way to monitor the queue process and show when jobs are consumed and their states in processing.**
The app running on `http://localhost:3000/` has a queue monitor on the right.

---