import { useEffect, useState } from "react";
import useSocket from "./Socket";

function Ping() {
    const socket = useSocket();

    const [ping, setPing] = useState(-1);

    useEffect(() => {
        socket.on("pingValue", (data: number) => {
            setPing(data);
        });
    }, []);
    
    useEffect(() => {
        console.log("hey")
    });

    return <>{ping}</>
}

export default Ping