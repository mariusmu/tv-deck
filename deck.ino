#include <ArduinoHttpClient.h>
#include <ESP8266WiFi.h>

const int key1Pin = 3;
const int key2Pin = 14;
const int key3Pin = 0;
const int key4Pin = 2;
const int key5Pin = 12;
const int key6Pin = 13;
const int key7Pin = 4;
const int key8Pin = 5;

bool cleared = true;

const char* ssid = "";    // Enter SSID here
const char* password = "";  //Enter Password here
const char host[] = "";

WiFiClient client;
HttpClient httpClient = HttpClient(client, host, 3000);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(key1Pin, INPUT_PULLUP);
  pinMode(key2Pin, INPUT_PULLUP);
  pinMode(key3Pin, INPUT_PULLUP);
  pinMode(key4Pin, INPUT_PULLUP);
  pinMode(key5Pin, INPUT_PULLUP);
  pinMode(key6Pin, INPUT_PULLUP);
  pinMode(key7Pin, INPUT_PULLUP);
  pinMode(key8Pin, INPUT_PULLUP);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void handlePress(int key) {
  if (!cleared) return;
  Serial.print("Key ");
  Serial.print(key);
  Serial.println(" was pressed");
  sendReq(key);
  cleared = false;
}

void sendReq (int sec) {
  if (client.connect(host,3000)) 
  { 
    Serial.println("Connected to host");
    client.print("GET /execute/" + String(sec) + " ");
    client.print("HTTP/1.1\n");
    client.print("Host: 0.0.0.0:3000\n");
    client.print("Connection: close\n\n\n");
    client.stop();
    Serial.println("");
  }
}


void loop() {
  bool checked = false;
  
  if(digitalRead(key1Pin) == LOW) {
    handlePress(2);
    checked = true;
  }
  if(digitalRead(key2Pin) == LOW) {
    handlePress(4);
    checked = true;
  }
  if(digitalRead(key3Pin) == LOW) {
    handlePress(3);
    checked = true;
  }
  if(digitalRead(key4Pin) == LOW) {
    handlePress(6);
    checked = true;
  }
  if(digitalRead(key5Pin) == LOW) {
    handlePress(1);
    checked = true;
  }
  if(digitalRead(key6Pin) == LOW) {
    handlePress(5);
    checked = true;
  }
  if(digitalRead(key7Pin) == LOW) {
    handlePress(9);
    checked = true;
  }      
  if(digitalRead(key8Pin) == LOW) {
     handlePress(8);
     checked = true;
  }   

  if (!checked) {
    cleared = true;
  }
  delay(50);
}