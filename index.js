'use strict'

const R = require('ramda')

function run() {
  calculateTimeElapsed(45)
}

function modeOneRecursive(clockState) {
  const initialState = clockState

  let doMoveBall = (minutes, currentClockState) => {
    console.log(`minute number: ${minutes}`)

    if (R.equals(initialState.mainQueue, currentClockState.mainQueue))
      return minutes;
    else
      setTimeout(()=>{ return doMoveBall(++minutes, moveBall(currentClockState));}, 0)
  }

  return doMoveBall(1, moveBall(initialState))
}

function modeOne(clockState) {

  let initialState = clockState
  let newClockState = initialState

  let minutes = 0

  do
  {
    ++minutes
    newClockState = moveBall(newClockState)
  }
  while(!compareQueues(initialState, newClockState))

  return minutes
}

function compareQueues(initialState, compareTo)
{

  let equals = true

  if(compareTo.mainQueue.length !== initialState.mainQueue.length)
    equals = false
  else
  {
    for(let i = 0; i<initialState.mainQueue.length; i++)
    {
      if(initialState.mainQueue[i] !== compareTo.mainQueue[i])
      {
        equals = false
        break;
      }      
    }
  }

  return equals
}

function moveBall(clockState) {

  let {mainQueue, minutesStack, fivesStack, hoursStack} = clockState;

  let [ball, ...tail] = mainQueue
  mainQueue = tail

  if (minutesStack.length < 4) {
    minutesStack.push(ball)
  } else if (fivesStack.length < 11) {
    fivesStack.push(ball)
    mainQueue = [...mainQueue, ...R.reverse(minutesStack)]
    minutesStack = []
  } else if (hoursStack.length < 11) {
    hoursStack.push(ball)
    mainQueue = [...mainQueue, ...R.reverse(minutesStack), ...R.reverse(fivesStack)]
    minutesStack = []
    fivesStack = []
  } else {
    mainQueue = [...mainQueue, ...R.reverse(minutesStack), ...R.reverse(fivesStack), ...R.reverse(hoursStack), ball]
    minutesStack = []
    fivesStack = []
    hoursStack = []
  }

  return {
    mainQueue,
    minutesStack,
    fivesStack,
    hoursStack
  }
}

function calculateTimeElapsed(startingSize) {
  try {

    console.log('Starting Calculation')

    console.time('modeOne-time')

    const totalMinutes = modeOne(getNewClock(startingSize))

    let timeEnd = console.timeEnd('modeOne-time')
    console.log(`Time elapsed ${timeEnd/1000}s`)

    console.log(`Total minutes: ${totalMinutes}`)

    const totalDays = (totalMinutes / 60) / 24
    console.log(`Total days: ${totalDays}`)

  } catch (e) {
    console.log(e.message)
  }
}

function populateQueue(size) {
  if (size < 27 || size > 127) {
    throw new Error("Starting size must be between 27 and 127");
  } else {

    var startingQueue = []

    for (let i = 1; i <= size; i++) {
      startingQueue.push({
        id: i
      })
    }

    return startingQueue
  }
}

function getNewClock(size)  {  
  return { mainQueue: populateQueue(size), minutesStack: [], fivesStack: [], hoursStack: []}
}



run()