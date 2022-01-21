import { useEffect } from "react";
import { Joystick } from "react-joystick-component";
import { IJoystickCoordinates, IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { Direction } from "./Controls";
import useSocket from "./Socket";

let lastDirection: string | null = null;

function parseDirection(direction: string): Direction {
   switch(direction) {
         case "up":
            return Direction.UP;
         case "down":
            return Direction.DOWN;
         case "left":
            return Direction.LEFT;
         case "right":
            return Direction.RIGHT;
         default:
            return Direction.CENTER;
   }
}

function JoyStick() {
   const socket = useSocket();

   const move = (event: IJoystickUpdateEvent) => {
      const direction = event.direction;
      if (direction !== lastDirection) {
         console.log(direction);
         socket.emit("direction_update", direction);
         lastDirection = direction;
      }
   }

   return <Joystick size={screen.width / 2} baseColor="#ccc" stickColor="#555" move={move}></Joystick>
}

export default JoyStick