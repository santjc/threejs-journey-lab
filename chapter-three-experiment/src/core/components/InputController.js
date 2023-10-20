import Component from "../ecs/Component.js";
export default class InputController extends Component {
  constructor() {
    super();
    this.Init();
  }

  Init() {
    this.current = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      mouseX: 0,
      mouseY: 0,
      space: false,
      mouseXDelta: 0,
      mouseYDelta: 0,
    };

    this.previous = null;
    this.keys = {};
    this.previousKeys = {};
    document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
    document.addEventListener("mousemove", (e) => this.onMouseMove(e), false);
    document.addEventListener("mousedown", (e) => this.onMouseDown(e), false);
    document.addEventListener("mouseup", (e) => this.onMouseUp(e), false);
  }

  onKeyDown(e) {
    this.keys[e.keyCode] = true;
  }
  onKeyUp(e) {
    this.keys[e.keyCode] = false;
  }
  onMouseMove(e) {
    this.current.mouseX = e.pageX - window.innerWidth / 2;
    this.current.mouseY = e.pageY - window.innerHeight / 2;
    this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
    this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;
  }
  onMouseDown(e) {
    switch (e.button) {
      case 0:
        this.current.left = true;
        break;
      case 1:
        this.current.middle = true;
        break;
      case 2:
        this.current.right = true;
        break;
    }
  }
  onMouseUp(e) {
    switch (e.button) {
      case 0:
        this.current.left = false;
        break;
      case 1:
        this.current.middle = false;
        break;
      case 2:
        this.current.right = false;
        break;
    }
  }
  key(keyCode) {
    return !!this.keys[keyCode];
  }
  update() {
    this.previous = { ...this.current };
  }
}
