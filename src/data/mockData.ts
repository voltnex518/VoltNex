import type { Project, Category, Tutorial, Resource, SiteSettings, ContactSubmission } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Arduino',
    slug: 'arduino',
    description: 'Microcontroller basics, shields, real-time sensor loops, and DIY automation.',
    icon: 'Cpu',
    display_order: 1,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'ESP32 & ESP8266',
    slug: 'esp32-esp8266',
    description: 'Dual-core computing, Wi-Fi, BLE, ultra-low power deep sleep, and edge logic.',
    icon: 'Wifi',
    display_order: 2,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'IoT & Connected Devices',
    slug: 'iot',
    description: 'MQTT brokers, cloud dashboards, telemetry nodes, and remote control.',
    icon: 'Radio',
    display_order: 3,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Robotics & Mechatronics',
    slug: 'robotics',
    description: 'Motor drivers, kinematics, rovers, servo mechanics, and autonomous navigation.',
    icon: 'Bot',
    display_order: 4,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Sensors & Instrumentation',
    slug: 'sensors',
    description: 'Environmental monitoring, IMUs, analog signal conditioning, and optical sensors.',
    icon: 'Gauge',
    display_order: 5,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Embedded Systems & RTOS',
    slug: 'embedded-systems',
    description: 'FreeRTOS, bare-metal C/C++, hardware timers, DMA, and custom PCB design.',
    icon: 'CircuitBoard',
    display_order: 6,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    title: 'ESP32 Dual-Core IoT Weather Station with E-Paper Display',
    slug: 'esp32-epaper-weather-station',
    summary: 'Ultra-low power desk weather station running on an ESP32. Fetches OpenWeather data via Wi-Fi, samples local indoor temperature and humidity via BME280, and renders crisp typography on a 2.9" tri-color e-Paper screen before entering deep sleep.',
    description: `## Project Overview

The VoltNex ESP32 Weather Station is engineered for ultra-long battery life and zero screen glare. Traditional LCD/OLED screens drain battery current continuously even when presenting static data. This design pairs an ESP32-WROOM-32 with a 2.9-inch SPI e-Paper display that consumes zero power once drawn.

### Dual-Core Architecture
- **Core 0 (PRO_CPU)** handles network connectivity, NTP time synchronization, and HTTP JSON payload ingestion from the OpenWeatherMap REST API.
- **Core 1 (APP_CPU)** interfaces with the I2C Bosch BME280 sensor to capture local barometric pressure, relative humidity, and temperature.
- Framebuffer rendering is managed via GxEPD2 and piped over high-speed hardware SPI.
- An automatic 30-minute deep sleep timer preserves battery life, yielding up to 6 months of continuous operation on a single 18650 Li-Ion cell.`,
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    difficulty: 'Intermediate',
    estimated_time: '4-6 Hours',
    status: 'published',
    featured: true,
    circuit_diagram_url: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80',
    wiring_notes: 'Connect BME280 SDA to GPIO 21 and SCL to GPIO 22 with 4.7kΩ pull-up resistors if not onboard. Connect E-Paper SPI: CS->GPIO 5, DC->GPIO 17, RST->GPIO 16, BUSY->GPIO 4, DIN->GPIO 23 (MOSI), CLK->GPIO 18 (SCK). Power with 3.3V rail only.',
    troubleshooting_notes: '- Display shows faint artifacts: Force full refresh cycle every 5th wakeup.\n- ESP32 fails to wake: Verify GPIO 16 (RST) is not held low by external pull-down.\n- Wi-Fi timeout: Ensure connection to 2.4 GHz band (5 GHz is unsupported).',
    safety_notes: 'Verify Li-ion battery polarity before inserting into holder. Overvoltage beyond 3.6V directly to ESP32 VDD rail causes immediate hardware damage.',
    seo_title: 'ESP32 E-Paper Weather Station Blueprint | VoltNex',
    seo_description: 'Build an ultra-low power desk weather display with ESP32, e-Paper SPI display, BME280, and deep sleep battery optimization.',
    created_at: '2026-03-15T10:00:00Z',
    updated_at: '2026-03-20T14:30:00Z',
    categories: [
      INITIAL_CATEGORIES[1],
      INITIAL_CATEGORIES[2],
      INITIAL_CATEGORIES[4],
    ],
    tags: ['ESP32', 'E-Paper', 'BME280', 'IoT', 'Low Power', 'FreeRTOS'],
    components: [
      { id: 'c1', name: 'ESP32 NodeMCU Development Board (38-pin)', quantity: '1 unit', notes: 'ESP-WROOM-32 with Type-C or micro-USB', display_order: 1 },
      { id: 'c2', name: 'Waveshare 2.9" E-Paper Module (296x128)', quantity: '1 unit', notes: 'Tri-Color (Black/White/Red) SPI display', display_order: 2 },
      { id: 'c3', name: 'Bosch BME280 Environmental Sensor Module', quantity: '1 unit', notes: 'I2C pressure, humidity, temperature sensor', display_order: 3 },
      { id: 'c4', name: '18650 3.7V 2600mAh Li-ion Battery & Holder', quantity: '1 unit', notes: 'Protected cell with TP4056 USB-C charging board', display_order: 4 },
      { id: 'c5', name: 'HT7333-A Ultra-Low Quiescent LDO Regulator', quantity: '1 unit', notes: '3.3V 250mA output with 1.2µA quiescent current', display_order: 5 },
      { id: 'c6', name: 'Resistors (4.7kΩ, 10kΩ) and 100nF Ceramic Caps', quantity: '1 pack', notes: 'I2C pull-ups and power decoupling', display_order: 6 },
    ],
    steps: [
      {
        id: 's1',
        step_number: 1,
        title: 'Breadboard Prototyping & I2C Bus Verification',
        content: 'Mount the ESP32 on your breadboard. Wire the BME280 module: VCC to 3.3V, GND to GND, SDA to GPIO 21, and SCL to GPIO 22. Flash an I2C scanner sketch to verify detection at address 0x76 or 0x77.',
        image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 's2',
        step_number: 2,
        title: 'Connecting the Waveshare 2.9" E-Paper Module',
        content: 'Connect the SPI communication lines: CS to GPIO 5, DC to GPIO 17, RST to GPIO 16, BUSY to GPIO 4, DIN to GPIO 23 (MOSI), and CLK to GPIO 18 (SCK). Install the GxEPD2 library in your IDE.',
        image_url: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 's3',
        step_number: 3,
        title: 'Firmware Configuration and API Key Setup',
        content: 'Create a free API account on OpenWeatherMap. Populate your Wi-Fi credentials and OpenWeather API token in the configuration section. Compile and verify serial debug outputs.',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 's4',
        step_number: 4,
        title: 'Power Optimization and Enclosure Assembly',
        content: 'Bypass the dev board linear regulator by feeding 3.3V from the ultra-low quiescent HT7333 LDO directly to the 3.3V pin. Enclose in a 3D-printed angled desk stand.',
        image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      },
    ],
    code_snippets: [
      {
        id: 'cs1',
        title: 'Main Weather Station Firmware',
        filename: 'esp32_epaper_station.ino',
        language: 'cpp',
        code: `#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <GxEPD2_BW.h>

const char* ssid     = "VoltNex_Lab_WiFi";
const char* password = "lab_secure_pass";
const char* apiKey   = "your_openweather_api_key";
const char* cityId   = "1261481"; // City ID

#define uS_TO_S_FACTOR 1000000ULL
#define TIME_TO_SLEEP  1800 // 30 minutes in seconds

Adafruit_BME280 bme;
GxEPD2_BW<GxEPD2_290_T94, GxEPD2_290_T94::HEIGHT> display(
  GxEPD2_290_T94(/*CS=*/ 5, /*DC=*/ 17, /*RST=*/ 16, /*BUSY=*/ 4)
);

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  if (!bme.begin(0x76)) {
    Serial.println("BME280 not detected!");
  }

  display.init(115200);
  display.setRotation(1);

  WiFi.begin(ssid, password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  float indoorTemp = bme.readTemperature();
  float indoorHum  = bme.readHumidity();
  float outdoorTemp = 0.0;

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String("http://api.openweathermap.org/data/2.5/weather?id=") + cityId + "&appid=" + apiKey + "&units=metric";
    http.begin(url);
    if (http.GET() == HTTP_CODE_OK) {
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, http.getString());
      outdoorTemp = doc["main"]["temp"];
    }
    http.end();
    WiFi.disconnect(true);
    WiFi.mode(WIFI_OFF);
  }

  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setTextColor(GxEPD_BLACK);
    display.setTextSize(2);
    display.setCursor(15, 25);
    display.print("VoltNex Station");
    
    display.setTextSize(1);
    display.setCursor(15, 55);
    display.printf("Indoor: %.1f C | Humidity: %.1f %%", indoorTemp, indoorHum);
    display.setCursor(15, 80);
    display.printf("Outdoor: %.1f C", outdoorTemp);
    display.setCursor(15, 110);
    display.print("Next sync in 30 minutes (Deep Sleep)");
  } while (display.nextPage());

  display.powerOff();
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  esp_deep_sleep_start();
}

void loop() {}`,
        display_order: 1,
      },
    ],
    files: [
      {
        id: 'f1',
        title: 'Complete Arduino Firmware Sketch (.ino)',
        file_url: 'https://raw.githubusercontent.com/voltnex/firmware/main/esp32_epaper_station.ino',
        file_type: 'ino',
        file_size_bytes: 4800,
      },
      {
        id: 'f2',
        title: '3D Printable Angled Desk Stand STL Bundle (.zip)',
        file_url: 'https://voltnex-cdn.local/downloads/voltnex_epaper_stand_stl.zip',
        file_type: 'zip',
        file_size_bytes: 3400000,
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    title: 'Autonomous Obstacle Avoidance Rover with Ultrasonic Radar',
    slug: 'arduino-obstacle-avoidance-rover',
    summary: 'Dual-geared mobile robotics platform powered by Arduino Uno and an L298N H-Bridge. Features a pan-scanning ultrasonic sensor on an SG90 micro-servo that sweeps 180 degrees to calculate clear navigation vectors in real-time.',
    description: `## Autonomous Navigation Architecture

This project provides a robust foundation for mobile autonomous robotics. Rather than relying on static single-point proximity checks, the front-mounted ultrasonic transducer sweeps a 180-degree radar arc using an SG90 servo.

### Navigation Algorithm
1. Safe distance threshold is maintained at 25 cm.
2. Rover drives forward at pulse-width modulated (PWM) velocity.
3. Upon obstacle detection within the safety envelope, the rover halts and sweeps left (150°) and right (30°).
4. Compares sonar echo distance and steers toward the path of maximum clearance.
5. Employs back-out-and-pivot escape maneuvers if both sides are blocked.`,
    cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    difficulty: 'Beginner',
    estimated_time: '3-4 Hours',
    status: 'published',
    featured: true,
    circuit_diagram_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    wiring_notes: 'Arduino Pin D9->L298N IN1, D8->IN2, D7->IN3, D6->IN4. ENA and ENB connected to 5V jumpers or PWM pins D5/D10. HC-SR04: Trig->A1, Echo->A2. SG90 Servo Signal->D11. Connect common ground between Arduino and L298N.',
    troubleshooting_notes: '- Rover turns in place: Swap polarity of the motor wiring on the spinning side.\n- Ultrasonic sensor reads 0 cm continuously: Ensure trigger pulse width is >= 10µs.\n- Microcontroller reboots on motor startup: Connect a 100µF 16V electrolytic capacitor across L298N 12V and GND terminals.',
    safety_notes: 'Never power high-current DC gear motors from Arduino 5V pin. Always provide an isolated battery power feed to the motor driver.',
    seo_title: 'Autonomous Obstacle Avoidance Rover Guide | VoltNex',
    seo_description: 'Step-by-step instructions to wire and code an Arduino obstacle-avoiding mobile robot with ultrasonic radar scanning.',
    created_at: '2026-03-10T12:00:00Z',
    updated_at: '2026-03-18T09:15:00Z',
    categories: [
      INITIAL_CATEGORIES[0],
      INITIAL_CATEGORIES[3],
      INITIAL_CATEGORIES[4],
    ],
    tags: ['Arduino', 'Robotics', 'Ultrasonic', 'Motor Driver', 'Autonomous', 'L298N'],
    components: [
      { id: 'c201', name: 'Arduino Uno R3 Microcontroller Board', quantity: '1 unit', notes: 'ATmega328P based standard board', display_order: 1 },
      { id: 'c202', name: 'L298N Dual H-Bridge Motor Driver Module', quantity: '1 unit', notes: 'Supports 2A per channel with thermal heatsink', display_order: 2 },
      { id: 'c203', name: 'HC-SR04 Ultrasonic Distance Sensor', quantity: '1 unit', notes: '4-pin 5V sonar module (2cm - 400cm range)', display_order: 3 },
      { id: 'c204', name: 'SG90 9g Micro Servo Motor', quantity: '1 unit', notes: 'Pan head mount for ultrasonic sensor', display_order: 4 },
      { id: 'c205', name: '2WD Smart Robot Car Chassis with TT Motors', quantity: '1 kit', notes: 'Includes acrylic chassis, wheels, castor wheel', display_order: 5 },
      { id: 'c206', name: '2x 18650 Battery Pack Holder (7.4V output)', quantity: '1 unit', notes: 'Primary motor power supply with power switch', display_order: 6 },
    ],
    steps: [
      {
        id: 's201',
        step_number: 1,
        title: 'Chassis & Gear Motor Assembly',
        content: 'Mount the dual TT gear motors onto the acrylic base plate using the provided M3 screws. Attach the rubber wheels and front ball castor.',
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 's202',
        step_number: 2,
        title: 'Mounting Motor Driver & Microcontroller',
        content: 'Fix the L298N driver and Arduino Uno board using brass standoffs. Connect the left and right motor pairs to terminals OUT1/OUT2 and OUT3/OUT4.',
        image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 's203',
        step_number: 3,
        title: 'Installing the Ultrasonic Pan Servo Radar',
        content: 'Mount the SG90 servo in the front bracket. Attach the ultrasonic sensor holder to the servo horn and zero the servo angle to 90 degrees.',
        image_url: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 's204',
        step_number: 4,
        title: 'Wiring Power and Flashing Obstacle Code',
        content: 'Route 7.4V battery output to L298N 12V terminal, and jumper L298N 5V output to Arduino VIN. Verify common ground and upload sketch.',
        image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      },
    ],
    code_snippets: [
      {
        id: 'cs201',
        title: 'Obstacle Avoidance Autonomous Firmware',
        filename: 'rover_obstacle_avoid.ino',
        language: 'cpp',
        code: `#include <Servo.h>

const int trigPin = A1;
const int echoPin = A2;
const int in1 = 9, in2 = 8, in3 = 7, in4 = 6;

Servo radarServo;
const int SAFE_DISTANCE_CM = 25;

long readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 25000);
  if (duration == 0) return 400; // No obstacle within timeout
  return duration * 0.034 / 2;
}

void moveForward() {
  digitalWrite(in1, HIGH); digitalWrite(in2, LOW);
  digitalWrite(in3, HIGH); digitalWrite(in4, LOW);
}

void haltMotors() {
  digitalWrite(in1, LOW); digitalWrite(in2, LOW);
  digitalWrite(in3, LOW); digitalWrite(in4, LOW);
}

void turnLeft() {
  digitalWrite(in1, LOW); digitalWrite(in2, HIGH);
  digitalWrite(in3, HIGH); digitalWrite(in4, LOW);
  delay(400);
  haltMotors();
}

void turnRight() {
  digitalWrite(in1, HIGH); digitalWrite(in2, LOW);
  digitalWrite(in3, LOW); digitalWrite(in4, HIGH);
  delay(400);
  haltMotors();
}

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(in1, OUTPUT); pinMode(in2, OUTPUT);
  pinMode(in3, OUTPUT); pinMode(in4, OUTPUT);
  
  radarServo.attach(11);
  radarServo.write(90);
  delay(500);
}

void loop() {
  long forwardDist = readDistance();
  
  if (forwardDist > SAFE_DISTANCE_CM) {
    moveForward();
  } else {
    haltMotors();
    delay(200);
    
    // Look left
    radarServo.write(150);
    delay(400);
    long leftDist = readDistance();
    
    // Look right
    radarServo.write(30);
    delay(400);
    long rightDist = readDistance();
    
    // Return servo to center
    radarServo.write(90);
    delay(200);
    
    if (leftDist > rightDist && leftDist > SAFE_DISTANCE_CM) {
      turnLeft();
    } else if (rightDist >= leftDist && rightDist > SAFE_DISTANCE_CM) {
      turnRight();
    } else {
      // Reverse briefly
      digitalWrite(in1, LOW); digitalWrite(in2, HIGH);
      digitalWrite(in3, LOW); digitalWrite(in4, HIGH);
      delay(400);
      turnRight();
    }
  }
}`,
        display_order: 1,
      },
    ],
    files: [
      {
        id: 'f201',
        title: 'Arduino Autonomous Navigation Source (.ino)',
        file_url: 'https://raw.githubusercontent.com/voltnex/firmware/main/rover_obstacle_avoid.ino',
        file_type: 'ino',
        file_size_bytes: 3200,
      },
      {
        id: 'f202',
        title: 'Wiring Schematic and Pinout Diagram (.pdf)',
        file_url: 'https://voltnex-cdn.local/downloads/voltnex_rover_schematic.pdf',
        file_type: 'pdf',
        file_size_bytes: 1800000,
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    title: 'LoRa Long-Range Precision Soil Telemetry Node',
    slug: 'lora-soil-telemetry-node',
    summary: 'Solar-powered, sub-GHz LoRa telemetry probe monitoring soil moisture, electrical conductivity, and subterranean temperature across a 5km radius without cellular subscriptions.',
    description: `## Precision Agriculture Node

Built for off-grid deployment, this node combines a custom low-power ATmega328P 3.3V architecture with an SX1276 868/915MHz LoRa transceiver.

### Environmental Resistance
Utilises capacitive frequency sensing instead of resistive probes to prevent galvanic corrosion in moist soils. Data packets are broadcast every 15 minutes to an edge gateway.`,
    cover_image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80',
    difficulty: 'Advanced',
    estimated_time: '6-8 Hours',
    status: 'published',
    featured: true,
    circuit_diagram_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    wiring_notes: 'SX1276 SPI: SCK->D13, MISO->D12, MOSI->D11, NSS->D10, DIO0->D2. Soil sensor powered via digital pin D4 to avoid continuous current consumption.',
    troubleshooting_notes: '- Packet loss over 1km: Ensure antenna ground plane impedance matching is observed (50Ω SMA coax).\n- Excessive sleep current: Ensure ADC is powered down during watchdog sleep.',
    safety_notes: 'Always screw on the 868/915MHz antenna before powering up the LoRa module; transmitting without an antenna can reflect RF energy and burn out the power amplifier.',
    seo_title: 'LoRa Soil Telemetry Node Blueprint | VoltNex',
    seo_description: 'Build a long-range LoRa farm telemetry station with capacitive soil sensing, watchdog sleep, and solar charging.',
    created_at: '2026-02-28T08:00:00Z',
    updated_at: '2026-03-05T16:20:00Z',
    categories: [
      INITIAL_CATEGORIES[2],
      INITIAL_CATEGORIES[4],
      INITIAL_CATEGORIES[5],
    ],
    tags: ['LoRa', 'Sub-GHz', 'Agriculture', 'Capacitive Sensor', 'Solar', 'Low Power'],
    components: [
      { id: 'c301', name: 'ATmega328P Pro Mini 3.3V 8MHz Board', quantity: '1 unit', notes: 'Native 3.3V operation eliminates level shifting', display_order: 1 },
      { id: 'c302', name: 'Semtech SX1276 LoRa Transceiver Module (868/915MHz)', quantity: '1 unit', notes: '+20 dBm RF output with SMA antenna connector', display_order: 2 },
      { id: 'c303', name: 'Capacitive Soil Moisture Sensor v1.2', quantity: '1 unit', notes: 'Corrosion-resistant analog frequency output', display_order: 3 },
      { id: 'c304', name: 'DS18B20 Waterproof Temperature Probe', quantity: '1 unit', notes: '1-Wire digital temperature sensing probe', display_order: 4 },
      { id: 'c305', name: '5V 1W Monocrystalline Solar Panel & CN3065 Board', quantity: '1 kit', notes: 'Outdoor solar harvesting battery charger', display_order: 5 },
    ],
    steps: [
      {
        id: 's301',
        step_number: 1,
        title: 'Transceiver Wiring & SPI Interfacing',
        content: 'Solder pin headers to the SX1276 module. Connect SPI bus lines to the Pro Mini (SCK to D13, MISO to D12, MOSI to D11, NSS to D10). Connect DIO0 to external interrupt D2.',
        image_url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 's302',
        step_number: 2,
        title: 'Sensor Power Gating Circuit',
        content: 'Connect the VCC of the capacitive sensor to Arduino D4. By asserting D4 HIGH only during readings and driving it LOW during sleep, idle current drain is eliminated.',
        image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 's303',
        step_number: 3,
        title: 'Deep Sleep and Watchdog Routine',
        content: 'Implement the LowPower library to enter Power Down mode. Configure the 8-second watchdog timer in a loop to accumulate a 15-minute telemetry sleep period.',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      },
    ],
    code_snippets: [
      {
        id: 'cs301',
        title: 'LoRa Soil Telemetry Node Firmware',
        filename: 'lora_soil_node.ino',
        language: 'cpp',
        code: `#include <SPI.h>
#include <LoRa.h>
#include <LowPower.h>

#define NSS_PIN   10
#define RESET_PIN 9
#define DIO0_PIN  2
#define SENSOR_PWR 4
#define SENSOR_ADC A0

void setup() {
  Serial.begin(9600);
  pinMode(SENSOR_PWR, OUTPUT);
  digitalWrite(SENSOR_PWR, LOW);

  LoRa.setPins(NSS_PIN, RESET_PIN, DIO0_PIN);
  if (!LoRa.begin(915E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  
  LoRa.setTxPower(20);
  LoRa.setSpreadingFactor(10);
  LoRa.setSignalBandwidth(125E3);
}

void loop() {
  // Power on sensor
  digitalWrite(SENSOR_PWR, HIGH);
  delay(50); // Allow sensor oscillator to settle
  int rawValue = analogRead(SENSOR_ADC);
  digitalWrite(SENSOR_PWR, LOW);

  // Send packet
  LoRa.beginPacket();
  LoRa.print("VNX_SOIL;NODE:01;ADC:");
  LoRa.print(rawValue);
  LoRa.endPacket();

  LoRa.sleep();

  // Sleep for ~15 minutes (112 * 8s = 896s)
  for (int i = 0; i < 112; i++) {
    LowPower.powerDown(SLEEP_8S, ADC_OFF, BOD_OFF);
  }
}`,
        display_order: 1,
      },
    ],
    files: [
      {
        id: 'f301',
        title: 'LoRa Node Arduino Sketch (.ino)',
        file_url: 'https://raw.githubusercontent.com/voltnex/firmware/main/lora_soil_node.ino',
        file_type: 'ino',
        file_size_bytes: 2900,
      },
    ],
  },
];

export const INITIAL_TUTORIALS: Tutorial[] = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    title: 'ESP32 FreeRTOS Multitasking: Core Pinning, Queues & Semaphores',
    slug: 'esp32-freertos-multitasking-guide',
    summary: 'Learn how to leverage both Xtensa cores on your ESP32. Avoid blocking delays, manage concurrency safely with queues and mutexes, and prevent watchdog panics.',
    content: `# Mastering FreeRTOS on the ESP32

The ESP32 SoC incorporates two 32-bit Xtensa LX6 microprocessors: **PRO_CPU (Protocol CPU, Core 0)** and **APP_CPU (Application CPU, Core 1)**.

While standard Arduino \`setup()\` and \`loop()\` execute on Core 1 by default, high-performance embedded systems require delegating network tasks, sensor polling, and display refreshes to dedicated RTOS tasks.

\`\`\`cpp
// Creating an RTOS Task pinned to Core 0
xTaskCreatePinnedToCore(
  sensorTaskCode,    /* Task function */
  "SensorTask",      /* Name of task */
  4096,              /* Stack size of task */
  NULL,              /* Parameter of the task */
  1,                 /* Priority of the task */
  &sensorTaskHandle, /* Task handle to track */
  0                  /* Pin task to Core 0 */
);
\`\`\`

## 1. Task Priorities & Preemption
FreeRTOS uses priority numbers where higher numbers denote higher priority. Always yield or insert \`vTaskDelay()\` in tight loops to prevent starving the Idle task and triggering the FreeRTOS Task Watchdog Timer (TWDT).

## 2. Safe Inter-Task Communication with Queues
Avoid modifying shared global variables directly across cores. Use FreeRTOS Queues to pass telemetry structs safely without race conditions.`,
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    difficulty: 'Intermediate',
    read_time: '12 min read',
    status: 'published',
    featured: true,
    tags: ['ESP32', 'FreeRTOS', 'C++', 'Embedded Systems', 'Concurrency'],
    category_id: 'c1000000-0000-0000-0000-000000000002',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-02T10:00:00Z',
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    title: 'Demystifying I2C & SPI: Pull-Up Resistors, Clock Speed, and Signal Integrity',
    slug: 'i2c-spi-protocol-deep-dive',
    summary: 'An electrical engineering guide to debugging serial communications. How to select pull-up resistor values, eliminate bus capacitance ringing, and troubleshoot packet corruption.',
    content: `# Understanding I2C vs SPI Under the Hood

When microcontroller sensors fail to communicate, 90% of the root causes stem from incorrect bus topology or impedance mismatches.

## I2C Bus Physics (Open-Drain)
Because I2C lines (SDA, SCL) are open-drain, devices can only pull lines LOW. Pull-up resistors restore the line to HIGH (VCC).

If the total bus capacitance exceeds 400pF, rise times distort from crisp square waves into rounded exponential curves, causing false clock edge detection.

### Calculating Optimal Pull-Up Values
- **Standard Mode (100 kHz)**: Recommend 4.7kΩ to 10kΩ
- **Fast Mode (400 kHz)**: Recommend 2.2kΩ to 3.3kΩ
- **High Noise Environments**: Place a 100nF ceramic bypass capacitor adjacent to each sensor VCC pin.`,
    cover_image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80',
    difficulty: 'Advanced',
    read_time: '15 min read',
    status: 'published',
    featured: true,
    tags: ['I2C', 'SPI', 'Hardware Debugging', 'Oscilloscopes', 'Signal Integrity'],
    category_id: 'c1000000-0000-0000-0000-000000000005',
    created_at: '2026-02-15T14:00:00Z',
    updated_at: '2026-02-18T11:00:00Z',
  },
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    title: 'VoltNex Universal Microcontroller Pinout Reference Guide',
    slug: 'voltnex-microcontroller-pinout-guide',
    description: 'High-resolution vector printable reference detailing pin capabilities, ADC channels, PWM timers, and I2C/SPI mappings for Arduino Uno, Nano, ESP32-WROOM, and RP2040.',
    file_url: 'https://voltnex-cdn.local/downloads/VoltNex_MCU_Pinout_Reference_v1.pdf',
    file_name: 'VoltNex_MCU_Pinout_Reference_v1.pdf',
    file_type: 'pdf',
    file_size_bytes: 4210000,
    technology: 'General Electronics',
    status: 'published',
    download_count: 142,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    title: 'ESP32 Ultra-Low Power Deep Sleep & Timer Wakeup Template',
    slug: 'esp32-deep-sleep-ulp-template',
    description: 'Clean boilerplate C++ code for ESP32 deep sleep, RTC memory variable persistence across wake cycles, and sensor power gate transistor switching.',
    file_url: 'https://voltnex-cdn.local/downloads/esp32_deep_sleep_boilerplate.ino',
    file_name: 'esp32_deep_sleep_boilerplate.ino',
    file_type: 'ino',
    file_size_bytes: 14300,
    technology: 'ESP32',
    status: 'published',
    download_count: 318,
    created_at: '2026-01-15T11:00:00Z',
    updated_at: '2026-01-15T11:00:00Z',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000003',
    title: 'Obstacle Rover Chassis 3D Printable STL & CAD Bundle',
    slug: 'obstacle-rover-cad-stl-bundle',
    description: 'Complete 3D printable mechanical files (.STL) and laser cutting vectors (.DXF) for the VoltNex dual-wheel obstacle avoidance rover platform.',
    file_url: 'https://voltnex-cdn.local/downloads/voltnex_rover_chassis_cad.zip',
    file_name: 'voltnex_rover_chassis_cad.zip',
    file_type: 'zip',
    file_size_bytes: 18450000,
    technology: 'Robotics',
    status: 'published',
    download_count: 89,
    created_at: '2026-02-01T15:00:00Z',
    updated_at: '2026-02-01T15:00:00Z',
  },
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: 'global',
  site_name: 'VoltNex Labs',
  tagline: 'Power Ideas. Build the Future.',
  description: 'An open-access electronics, embedded systems, robotics, and maker-education platform where builders discover verified schematics, firmware, and step-by-step guides.',
  creator_name: 'Pradeep',
  creator_instagram: '@pradeep_ln22',
  contact_email: 'voltnex518@gmail.com',
  announcement_banner: 'Welcome to VoltNex Labs! Explore our newly published ESP32, Arduino, and Robotics project blueprints.',
  featured_project_ids: ['a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002'],
  updated_at: '2026-03-20T12:00:00Z',
};

export const INITIAL_MESSAGES: ContactSubmission[] = [
  {
    id: 'm1',
    name: 'Aarav Patel',
    email: 'aarav.maker@example.com',
    subject: 'Question on ESP32 e-Paper refresh rate',
    message: 'Hello Pradeep, loved your weather station tutorial! Question regarding partial refresh: did you observe ghosting after 24 hours of continuous operation?',
    status: 'read',
    created_at: '2026-03-18T14:22:00Z',
  },
  {
    id: 'm2',
    name: 'Sarah Jenkins',
    email: 'sjenkins.robotics@example.com',
    subject: 'Collaboration on Open Source Rover Firmware',
    message: 'Hi team VoltNex! We are testing your obstacle rover in our university robotics club. We would love to contribute an encoder-based PID speed controller snippet.',
    status: 'unread',
    created_at: '2026-03-20T08:14:00Z',
  },
];
