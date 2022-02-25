# DYI project to control LG-tv from DIY keyboard

Purpose was to allow my 4 year old boy to control the TV. The remote controls were not easy to use so I made a dead simple keyboard controller.

## Hardware
- ESP8266 microcontroller
- CHerry MX White silent x6
- 3d printed enclosure
- USB-cable

It is using the WIFI to connect to LG WebOS.

## Software
- Arduino sketch file with ArduinoHttpClient and ESP8266WiFi libraries (look up how to integrate with ESP-modules)
- Node JS server using Express web api and lgtv2 library.
- Run from Docker at server

## Variables to change
1. Change IP/port Under src/command.ts to match your LG-TV
```javascript
const lgtv = require("lgtv2")({
    url: 'ws://0.0.0.0:3000'
});


```
2. Change WIFI-settings under dock.ino
```c
const char* ssid = "";    // Enter SSID here
const char* password = "";  //Enter Password here
const char host[] = "";
```

3. Under commands create your own specific commands to match your purpose


## Note
This is only a hobby project with very little effort. No unit-tests have been made. However this has been working like a charm for a year now.