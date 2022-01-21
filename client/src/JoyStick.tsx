import { useEffect } from "react";
import { Joystick } from "react-joystick-component";
import { IJoystickCoordinates, IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { Direction } from "./Controls";
import useSocket from "./Socket";

let lastDirection: string | null = null;

function parseDirection(direction: string): Direction {
   switch(direction) {
         case "FORWARD":
            return Direction.UP;
         case "BACKWARD":
            return Direction.DOWN;
         case "LEFT":
            return Direction.LEFT;
         case "RIGHT":
            return Direction.RIGHT;
            case "CENTER":
               return Direction.CENTER;
         default:
            return Direction.CENTER;
   }
}

function JoyStick() {
   const socket = useSocket();

   const move = (event: IJoystickUpdateEvent) => {
      const direction = event.type == "move" ? event.direction : "CENTER";
      if (direction !== lastDirection) {
         console.log(direction);
         socket.emit("direction_update", parseDirection(event.direction ?? "CENTER"));
         lastDirection = direction;
      }
   }

   return <Joystick size={screen.width / 2} baseColor="#ccc" stickColor="#555" move={move} stop={move}></Joystick>
}

export default JoyStick