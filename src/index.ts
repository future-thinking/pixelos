import PixelOS from "./pixelOs.js";
import { config } from "dotenv";

config();

PixelOS.init().start();
