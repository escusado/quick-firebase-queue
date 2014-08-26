# FireBQ

## Intro
A queue system written in javascript for managing coordinated jobs flow, with
dashboard monitor.

It's been created using

*   neon.js
*   borium
*   firebase (for job storage)

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

*   The workers can be written in any language. (I'm **assuming python, ruby & javascript**).
*   The jobs can be described as json objects.
*   The jobs are a combination of:
    *   file manipulations (crud)
    *   database manipulation
    *   external services consumption (file uploading/downloading, external api call)
*   A job can have a state object.
*   The workers are by nature async.

---

## Constrained solution









In this case a job can be defined as the composition of a state object:

```javascript
{
    state : 'state-name',
    data : {
        arbitrary: 'values'
    }
}
```

That contains the name for the current state of the object and the current data