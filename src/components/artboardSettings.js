import React from 'react';
import Size from '../classes/measures/size';
const { publish, subscribe } = require('../helpers/pubsub');

class ToolSettings extends React.Component {
  constructor (...args) {
    super(...args);
    this.state = {};
    subscribe('artboardSize', (size) => {
      console.log('artboardSize', size);
      this.setState({
        width: size.width,
        height: size.height,
      });
    });
  }

  render () {
    return (
      <div className="inline-block">
        <div className="inline-block">
          w: <input type="number" value={ this.state.width || 0 } onChange={ this.updateWidth } />
        </div>
        <div className="inline-block">
          h: <input type="number" value={ this.state.height || 0 } onChange={ this.updateHeight } />
        </div>
      </div>
    );
  }

  updateWidth = (event) => {
    const w = event.target.value;
    this.setState({ width: w }, this.publishUpdate);
  }

  updateHeight = (event) => {
    const h = event.target.value;
    this.setState({ height: h }, this.publishUpdate);
  }

  publishUpdate = () => {
    const size = new Size(this.state.width, this.state.height);
    publish('artboardSize', size);
  }
}

module.exports = ToolSettings;
