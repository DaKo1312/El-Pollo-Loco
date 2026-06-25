export class IntervalHub {
    static allIntervals = [];
    static startInterval (func, timer) {
        const newInterval = setIntervat(func, timer);
        IntervalHub.allIntervals.push(newInterval);
    }

    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}