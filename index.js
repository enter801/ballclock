'use strict'

const R = require('ramda')
const promptly = require('promptly')

async function run() {

    const mode = await promptly.prompt('Which mode of calculation?  Press 1 for Mode One, Press 2 for Mode Two.')

    if(mode === '1') {
        const modeOneBalls = await promptly.prompt('How many balls to use in mode one?')

        calculateTimeElapsed(parseInt(modeOneBalls))
    }

    if(mode === '2') {

        const minutes = await promptly.prompt('How many minutes to run for mode two? ')
        const modeTwoBalls = await promptly.prompt('How many balls to use for mode two? ')
    
        const initialClockState = getNewClock(parseInt(modeTwoBalls))

        const results = modeTwo(parseInt(minutes), initialClockState)

        console.log(results)
    }
}

function modeOne(clockState) {

    const initialState = clockState
    let newClockState = initialState

    var minutes = 0

    do {
        ++minutes
        newClockState = moveBall(newClockState)
    }
    while (!compareQueues(initialState, newClockState))

    return minutes
}

function modeTwo(minutes, clockState)
{
  
    for(let i = 0; i < minutes; i++ )
    {
        clockState = moveBall(clockState)
    }

    return JSON.stringify(clockState)
}

function compareQueues(initialState, compareTo) {

    let equals = true

    if (compareTo.mainQueue.length !== initialState.mainQueue.length)
        equals = false
    else {
        for (let i = 0; i < initialState.mainQueue.length; i++) {
            if (initialState.mainQueue[i] !== compareTo.mainQueue[i]) {
                equals = false
                break
            }
        }
    }

    return equals
}

function moveBall(clockState) {

    let {
        mainQueue,
        minutesStack,
        fivesStack,
        hoursStack
    } = clockState

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

        const startTime = Date.now()

        const totalMinutes = modeOne(getNewClock(startingSize))

        const endTime = Date.now()
        const elapsed = endTime - startTime
        const totalDays = (totalMinutes / 60) / 24

        console.log(`${startingSize} balls cycle after ${totalDays} days.`)
        console.log(`Completed in ${elapsed} milliseconds (${elapsed/1000}) seconds.`)

    } catch (e) {
        console.log(e.message)
    }
}

function populateQueue(size) {
    if (size < 27 || size > 127) {
        throw new Error('Starting size must be between 27 and 127')
    } else {

        var startingQueue = []

        for (let i = 1; i <= size; i++) {
            startingQueue.push(i)
        }

        return startingQueue
    }
}

function getNewClock(size) {
    return {
        mainQueue: populateQueue(size),
        minutesStack: [],
        fivesStack: [],
        hoursStack: []
    }
}

run()