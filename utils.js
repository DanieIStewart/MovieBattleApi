
// debounce will take a function and a delay
// the funtion will run after the delay has passed

const debounce = (func, delay = 1000) => {
  // timeout holds return value
    let timeoutId;
    return (...args) => {
      // if search has already happened will remove last run
      if(timeoutId){
        // check if timeout id is defined if so clear
        clearTimeout(timeoutId);
      }
     timeoutId = setTimeout( () => {
      //  func will be able to take multiple arguments using apply()
        func.apply(null, args)
      }, delay)
    }
  }
  