const blessed = require('blessed');

const screen = blessed.screen({
  autopadding: true,
  smartCSR: true,
  title: 'Pico',
  fullUnicode: true,
});

const container = blessed.box({
  width: '100%',
  height: '100%',
  style: {
    bg: '#f00',
    fg: '#fff',
  },
});

screen.append(container)
container.setContent("hello")

screen.render()
