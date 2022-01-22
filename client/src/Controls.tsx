import JoyStick from "./JoyStick";

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    CENTER
  }
  

function Controls() {
    return <JoyStick />
}

export default Controls;