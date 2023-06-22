radio.setTransmitPower(7);
let mx = 0;
let my = 0;

radio.onDataPacketReceived(({ receivedString }) => {
    const x = receivedString.charCodeAt(0) + 0;
    const y = receivedString.charCodeAt(1) + 0;

    const leftSpeed = Math.map(x, 0, 255, -255, 255);
    const rightSpeed = Math.map(y, 0, 255, -215, 215);

    mx = x;
    my = y;
});

function moveCar(leftSpeed: number = 0, rightSpeed: number = 0) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, leftSpeed);
    PCAmotor.MotorRun(PCAmotor.Motors.M4, -rightSpeed);
}

basic.forever(() => {
    if (my === 128) {
        moveCar(0, 0);
    } else if (my >= 129 && mx >= 129) {
        const speed = (my - 128) * 2;
        const equality = speed / 6;
        const slow = (mx - 128) * 2;

        const finalSpeed = speed - slow;
        moveCar(speed, finalSpeed);
    } else if (my >= 129 && mx <= 127) {
        const speed = (my - 128) * 2;
        const equality = speed / 6;
        const slow = (128 - mx) * 2;

        moveCar(speed - slow, speed - equality);
    } else if (my <= 127 && mx >= 129) {
        const speedR = (128 - my) * -2;
        const equality = speedR / 6;
        const slowR = (mx - 128) * 2;

        const finalSpeed = speedR - slowR;
        moveCar(speedR, finalSpeed);
    } else if (my <= 127 && mx <= 127) {
        const speedR = (128 - my) * -2;
        const equality = speedR / 6;
        const slowR = (128 - mx) * 2;

        moveCar(speedR - slowR, speedR);
    }
});