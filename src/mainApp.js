import React from 'react';
import Application from './classes/application';
import Size from './classes/measures/size';

import Toolbar from './components/toolbar';
import ToolSettings from './components/toolSettings';

import debounce from './helpers/debounce';

const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;
let activeTool, app;

class MainApp extends React.Component {
  constructor (...args) {
    super(...args);
    app = new Application();
  }

  componentDidMount () {
    this.resizeCanvas();

    const size = this.getCanvasDimensions();
    app.setCanvas(this.canvas, size, DEVICE_PIXEL_RATIO);
    app.setActiveTool(activeTool);
    app.render();

    window.addEventListener("resize", () => {
      debounce(this.resizeCanvas.bind(this));
    });

    this.canvas.addEventListener('mousedown', (evt) => {
      app.mouseDown(evt.offsetX, evt.offsetY);
    });
    this.canvas.addEventListener('mousemove', (evt) => {
      app.mouseMove(evt.offsetX, evt.offsetY);
    });
    this.canvas.addEventListener('mouseup', (evt) => {
      app.mouseUp(evt.offsetX, evt.offsetY);
    });
    this.canvas.addEventListener('touchstart', (evt) => {
      app.touchStart(evt.touches);
    });
    this.canvas.addEventListener('touchmove', (evt) => {
      app.touchMove(evt.touches);
    });
    this.canvas.addEventListener('touchend', (evt) => {
      app.touchEnd(evt.touches);
    });
  }

  handleToolSelect = (tool) => {
    activeTool = tool;
    if (app) {
      app.setActiveTool(activeTool);
    }
  }

  getCanvasDimensions = () => {
    return new Size(this.canvas.parentNode.offsetWidth, this.canvas.parentNode.offsetHeight);
  }

  resizeCanvas = () => {
    if (!this.canvas) {
      return;
    }
    const w = this.canvas.parentNode.offsetWidth;
    const h = this.canvas.parentNode.offsetHeight;
    this.canvas.width = w * DEVICE_PIXEL_RATIO;
    this.canvas.height = h * DEVICE_PIXEL_RATIO;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    if (app) {
      app.updateSize(new Size(w, h));
      app.render();
    }
  }

  render () {
    return (
      <div className="full-height">
        <ToolSettings />
        <div id="wrapper">
          <Toolbar appInterface={ app.appInterface } onToolSelect={ this.handleToolSelect } />
          <div id="main">
            <div id="tabs"></div>
            <div id="canvas-container">
              <canvas id="canvas" ref={ c => this.canvas = c }></canvas>
            </div>
          </div>
          <div id="palettes"></div>
        </div>
      </div>
    );
  }
}

module.exports = MainApp;
