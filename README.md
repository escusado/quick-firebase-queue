# Firebq

A simple job queue manager for firebase based workers.

## Abstract

A simple javascript/node job queue for firebase based data workers.

### Constraints





# A services that consumes jobs in a queue

## The idea

A Drone simulator, that displays a grid divided map, and drones taking pictures
of each cell on the map.

### How it works

*   A map is created using the Map class (can be configured here: TODO).
*   A set of drone stations are placed next to the map (the number of station can be configured here: TODO)
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

# Requirements:

*   **correctness - The code should perform as specified, edge cases and errors should be handled.**
   *   The queue considers workers failing, and report for the error is added if the worker had one.
*   style - The code should be well written and easy to understand, comments should be added where necessary.
   *   Well thats for the reader to decide :). But the same logic and style is followed on front and back, events and oop is used across async logic actions.
*   tests - It would be great if there were some test coverage of core logic.
   *   The drone-simulator, uses all the `firebq` features:
      *   job queuing
      *   job succes handling
      *   job error handling

*   Design a service using Firebase & node.js that can consume jobs in a queue for processing.
   *   Firebq is a job queue that holds jobs for firebase based workers.
*   Use Firebase for the datastore where the queue and actual processed data should live.
   *   The firebq and the drone-simulator storage are on firebase.
*   Imagine a service which reads items from a queue, which contain data to indicate what kind of processing they require, that service should then dispatch those queued jobs to workers for processing.
   *   The Drone simulator app; displays a map and drones gathering data from it, the simulated data analisys happens on independent workers that manipulate the data directly. These workers are executed by `firebq` queue.
*   You can simulate the processing by using a timeout and updating a value to emulate a process that takes a bit of time and has an effect.
   *   The async logic in each worker is simulated this way.
*   It would also be great to have a dashboard that shows in real-time the states of the queue and the processing.
   *   The web app on  `localhost:3000/`, displays the worker queue status.

Once complete, you should have the following:

*   a node.js process that you can start which would initiate listening for new items in the queue.

```
node bin/firebq
```

*   a script to simulate pushing a new job to the queue
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

*   a way to monitor the queue process and show when jobs are consumed and their states in processing.
The app running on `http://localhost:3000/` has a queue monitor on the right.
