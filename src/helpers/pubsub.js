class PubSub {
  constructor () {
    this.subscribers = {};
  }

  subscribe = (key, fn) => {
    if (!this.subscribers[key]) {
      this.subscribers[key] = [];
    }
    const found = this.subscribers[key].find(sub => sub === fn);
    if (found) {
      return;
    }
    this.subscribers[key].push(fn);
  }

  publish = (key, data) => {
    if (!this.subscribers[key]) {
      return;
    }
    this.subscribers[key].forEach((subscriber) => {
      setTimeout(() => { // the setTimeout helps us get around setting state during React's render cycle
        subscriber(data);
      }, 0);
    });
  }
}

const pubSub = new PubSub();

module.exports = {
  publish: pubSub.publish,
  subscribe: pubSub.subscribe,
};
