let commandIsRunning = false;

const lgtv = require("lgtv2")({
    url: 'ws://0.0.0.0:3000'
});

lgtv.on('error', (err: any) => {
    console.log(err);
});

lgtv.on('connect', () => {
    console.log("Connected");
});

async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export enum Commands {
    NONE = 0,
    OFF = 1,
    LEFT = 2,
    RIGHT = 3,
    UP = 4,
    DOWN = 5,
    PROG1 = 6,
    PROG2 = 7,
    PROG3 = 8,
    OK = 9
};

export async function executeTVCommand(command: Commands) {
    if (commandIsRunning) {
        return;
    };
    commandIsRunning = true;
    await executeTvCommandInternal(command);
    commandIsRunning = false;
}

function executeTvCommandInternal(command: Commands) {
    switch(command) {
        case Commands.OFF:
            return executeButtonCall("BACK", 1);
        case Commands.LEFT:
            return executeButtonCall("LEFT", 1);
        case Commands.RIGHT:
            return executeButtonCall("RIGHT", 1);
        case Commands.UP:
            return executeButtonCall("UP", 1);
        case Commands.DOWN:
            return executeButtonCall("DOWN", 1);
        case Commands.PROG1:
            return startProgram("nrksuper", grizzly);
        case Commands.PROG2:
            return startProgram("nrksuper", chicken);
        case Commands.PROG3:
            return startProgram("youtube.leanback.v4", blippy);
        case Commands.OK:
            return executeButtonCall("ENTER", 1);
    }
}

function turnOfTv(): Promise<any> {
    return new Promise((resolve, reject) => {
        return lgtv.request('ssap://system/turnOff', (err: any, res: any) => {
            lgtv.disconnect();
            if (err) {
                return reject(err);
            } else {
                resolve("");
            }
        });
    });
}

function executeButtonCall(command: buttons, count: number): Promise<string> {
    return new Promise((resolve, reject) => {
        lgtv.getSocket('ssap://com.webos.service.networkinput/getPointerInputSocket',
        async (err: any, sock: any) => {
            if (!err) {
                for(let i = 0; i< count; i++) {
                    sock.send('button', {name: command});
                    await sleep(100);
                }
                resolve("");
            } else {
                reject(err);
            }
        });
    });
}

type buttons = "LEFT" | "RIGHT"| "UP" | "DOWN" | "ENTER" | "BACK";

function executeSequence(commands: buttons[]) {
    return new Promise((resolve, reject) => {
        lgtv.getSocket('ssap://com.webos.service.networkinput/getPointerInputSocket',
        async (err: any, sock: any) => {
            if (!err) {
                for(const com of commands) {
                    console.log("Sending " + com);
                    sock.send('button', {name: com});
                    await sleep(300);
                }
                resolve("");
            } else {
                reject(err);
            }
        });
    });
}

const grizzly: buttons[] = ["UP", "RIGHT", "RIGHT",
"RIGHT", "RIGHT", "ENTER", "RIGHT", "RIGHT", "RIGHT",
"RIGHT", "RIGHT", "ENTER", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "ENTER"];

const chicken: buttons[] = ["UP", "RIGHT", "RIGHT",
"RIGHT", "RIGHT", "ENTER",
"RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "ENTER",
"RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "ENTER"];

const blippy: buttons[] = [
    "LEFT", "LEFT", "UP", "ENTER",
    "RIGHT", "RIGHT", "RIGHT", "RIGHT", "ENTER",
    "DOWN", "RIGHT", "RIGHT", "ENTER",
    "LEFT", "LEFT", "LEFT", "ENTER",
    "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "RIGHT", "ENTER", "ENTER",
    "LEFT", "LEFT", "LEFT", "LEFT", "LEFT", "LEFT", "LEFT", "ENTER",
    "DOWN", "DOWN", "DOWN", "DOWN"
]

function closeProgram(program: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        lgtv.request('ssap://system.launcher/close', {id: program}, async (res: any, ex: any) => {
            resolve("OK");
        });
    });
}

function startProgram(program: string, sequence: buttons[]): Promise<string> {
    return new Promise(async (resolve, reject) => {
        await closeProgram(program);
        lgtv.request('ssap://system.launcher/launch', {id: program}, async (res: any, ex: any) => {
            await sleep(6000);
            await executeSequence(sequence)
            resolve("OK");
        });
    });
}
