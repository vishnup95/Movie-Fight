//
// Implement a simple debounce. setTimeout Returns a timerId. Clear it, you stop the setTimeout. Here, we check
// if there is an id and clear it. Otherwise, we create a new setTimeOut function that executes after 1s.
//
export const debounce = (func, delay = 1000) => {
	let timerId;
	return (...args) => {
		if (timerId) {
			clearTimeout(timerId);
		}
		timerId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
};
