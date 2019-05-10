onmessage = function (event) {
  console.log('Timer', 'New Interval ' + event.data + 'ms')
  setInterval(() => { postMessage(true) }, event.data)
}
