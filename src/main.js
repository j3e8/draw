import Application from './application';
import Size from './measures/size';

const devicePixelRatio = window.devicePixelRatio || 1;

let app;
let canvas;

window.addEventListener("load", () => {
  canvas = document.getElementById('canvas');
  resizeCanvas();
  const size = getCanvasDimensions();
  app = new Application(document.getElementById('canvas'), size, devicePixelRatio);
  app.render();
  initializeCanvasHandlers();
});

window.addEventListener("resize", () => {
  debounce(resizeCanvas);
});

function debounce(fn, ms) {
  if (!ms) {
    ms = 50;
  }
  clearTimeout(fn);
  setTimeout(fn.bind(this), ms);
}

function getCanvasDimensions() {
  return new Size(canvas.parentNode.offsetWidth, canvas.parentNode.offsetHeight);
}

function resizeCanvas() {
  if (!canvas) {
    return;
  }
  const w = canvas.parentNode.offsetWidth;
  const h = canvas.parentNode.offsetHeight;
  canvas.width = w * devicePixelRatio;
  canvas.height = h * devicePixelRatio;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  if (app) {
    app.updateSize(new Size(w, h));
    app.render();
  }
}

function initializeCanvasHandlers() {
  if (!canvas || !app) {
    return;
  }

  canvas.addEventListener('mousedown', (evt) => {
    app.mouseDown(evt.offsetX, evt.offsetY);
  });
  canvas.addEventListener('mousemove', (evt) => {
    app.mouseMove(evt.offsetX, evt.offsetY);
  });
  canvas.addEventListener('mouseup', (evt) => {
    app.mouseUp(evt.offsetX, evt.offsetY);
  });
  canvas.addEventListener('touchstart', (evt) => {
    app.touchStart(evt.touches);
  });
  canvas.addEventListener('touchmove', (evt) => {
    app.touchMove(evt.touches);
  });
  canvas.addEventListener('touchend', (evt) => {
    app.touchEnd(evt.touches);
  });
}
