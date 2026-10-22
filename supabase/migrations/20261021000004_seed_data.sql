-- VoltNex Seed Data
-- Migration: 20261021000004_seed_data.sql
-- Description: High-quality sample electronics, robotics, and embedded projects for development and demonstration

-- Insert Site Settings
INSERT INTO public.site_settings (
  id,
  site_name,
  tagline,
  description,
  creator_name,
  creator_instagram,
  contact_email,
  announcement_banner
) VALUES (
  'global',
  'VoltNex',
  'Power Ideas. Build the Future.',
  'An open-access electronics, embedded systems, robotics, and maker-education platform where builders discover verified schematics, firmware, and step-by-step guides.',
  'Pradeep',
  '@pradeep_ln22',
  'voltnex518@gmail.com',
  'Welcome to VoltNex! Explore our newly published ESP32 and Robotics project blueprints.'
) ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  creator_name = EXCLUDED.creator_name,
  creator_instagram = EXCLUDED.creator_instagram,
  contact_email = EXCLUDED.contact_email;

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon, display_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Arduino', 'arduino', 'Microcontroller basics, shields, real-time sensor loops, and DIY automation.', 'Cpu', 1),
  ('c1000000-0000-0000-0000-000000000002', 'ESP32 & ESP8266', 'esp32-esp8266', 'Dual-core computing, Wi-Fi, BLE, ultra-low power deep sleep, and edge logic.', 'Wifi', 2),
  ('c1000000-0000-0000-0000-000000000003', 'IoT & Connected Devices', 'iot', 'MQTT brokers, cloud dashboards, telemetry nodes, and remote control.', 'Radio', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Robotics & Mechatronics', 'robotics', 'Motor drivers, kinematics, rovers, servo mechanics, and autonomous navigation.', 'Bot', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Sensors & Instrumentation', 'sensors', 'Environmental monitoring, IMUs, analog signal conditioning, and optical sensors.', 'Gauge', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Embedded Systems & RTOS', 'embedded-systems', 'FreeRTOS, bare-metal C/C++, hardware timers, DMA, and custom PCB design.', 'CircuitBoard', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert Project 1: ESP32 E-Paper Weather Station
INSERT INTO public.projects (
  id,
  title,
  slug,
  summary,
  description,
  cover_image,
  difficulty,
  estimated_time,
  status,
  featured,
  circuit_diagram_url,
  wiring_notes,
  troubleshooting_notes,
  safety_notes,
  seo_title,
  seo_description
) VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'ESP32 Dual-Core IoT Weather Station with E-Paper Display',
  'esp32-epaper-weather-station',
  'Ultra-low power desk weather station running on an ESP32. Fetches OpenWeather data via Wi-Fi, samples local indoor temperature and humidity via BME280, and renders crisp typography on a 2.9" tri-color e-Paper screen before entering deep sleep.',
  '## Project Overview\n\nThe VoltNex ESP32 Weather Station is designed for ultra-long battery life and zero glare. Traditional LCD/OLED screens drain milliamp-hours even when static. This design pairs an ESP32-WROOM-32 with a 2.9-inch SPI e-Paper display that consumes zero power once refreshed.\n\n### Core Architecture\n1. **Core 0** handles Wi-Fi connection, NTP timestamp synchronisation, and HTTP JSON payload parsing from OpenWeatherMap.\n2. **Core 1** polls the I2C BME280 environmental sensor for local barometric pressure, humidity, and temperature.\n3. The framebuffer is composed with GxEPD2 and pushed to the display via SPI.\n4. Deep sleep is triggered with a 30-minute timer wakeup, yielding up to 6 months of battery life on a single 18650 Li-Ion cell.',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'Intermediate',
  '4-6 Hours',
  'published',
  true,
  'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80',
  'Connect BME280 SDA to GPIO 21 and SCL to GPIO 22 with 4.7kΩ pull-up resistors if not onboard. Connect E-Paper SPI: CS->GPIO 5, DC->GPIO 17, RST->GPIO 16, BUSY->GPIO 4, DIN->GPIO 23 (MOSI), CLK->GPIO 18 (SCK). Power with 3.3V rail only.',
  '- Display shows partial artifacts: Ensure full refresh is performed every 5th cycle.\n- ESP32 fails to wake from deep sleep: Verify GPIO 16 (RST) is not pulled permanently low.\n- Wi-Fi timeout: Ensure 2.4 GHz network is available (ESP32 does not support 5 GHz).',
  'Ensure Li-Ion battery polarity is strictly verified prior to connecting to TP4056 board. Overvoltage above 3.6V directly to ESP32 VDD will permanently damage the silicon.',
  'ESP32 E-Paper Weather Station Blueprint | VoltNex',
  'Build an ultra-low power desk weather display with ESP32, e-Paper SPI display, BME280, and deep sleep battery optimization.'
) ON CONFLICT (slug) DO NOTHING;

-- Project 1 Categories
INSERT INTO public.project_categories (project_id, category_id) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002'),
  ('a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003'),
  ('a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000005')
ON CONFLICT DO NOTHING;

-- Project 1 Components
INSERT INTO public.project_components (project_id, name, quantity, notes, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'ESP32 NodeMCU Development Board (38-pin)', '1', 'ESP-WROOM-32 with micro-USB or Type-C', 1),
  ('a1000000-0000-0000-0000-000000000001', 'Waveshare 2.9" E-Paper Module (296x128)', '1', 'Tri-Color (Black/White/Red) SPI interface', 2),
  ('a1000000-0000-0000-0000-000000000001', 'Bosch BME280 Sensor Module', '1', 'I2C pressure, humidity, and temperature sensor', 3),
  ('a1000000-0000-0000-0000-000000000001', '18650 3.7V 2600mAh Li-ion Battery & Holder', '1', 'Equipped with TP4056 USB-C charging module', 4),
  ('a1000000-0000-0000-0000-000000000001', 'HT7333-A Ultra-Low Quiescent LDO Regulator', '1', '3.3V 250mA output with 1.2µA quiescent current', 5)
ON CONFLICT DO NOTHING;

-- Project 1 Steps
INSERT INTO public.project_steps (project_id, step_number, title, content, image_url) VALUES
  ('a1000000-0000-0000-0000-000000000001', 1, 'Breadboard Prototyping & I2C Bus Verification', 'Seat the ESP32 on your breadboard. Wire the BME280 module to 3.3V, GND, SDA (GPIO 21), and SCL (GPIO 22). Run an I2C scanner sketch to confirm sensor detection at address 0x76 or 0x77.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'),
  ('a1000000-0000-0000-0000-000000000001', 2, 'Connecting the Waveshare 2.9" E-Paper Module', 'Wire the SPI bus lines: CS (GPIO 5), DC (GPIO 17), RST (GPIO 16), BUSY (GPIO 4), DIN (GPIO 23), and CLK (GPIO 18). Install the GxEPD2 library through Arduino IDE Library Manager.', 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'),
  ('a1000000-0000-0000-0000-000000000001', 3, 'Firmware Configuration and OpenWeather API Setup', 'Obtain your free API Key from OpenWeatherMap. Update secrets.h with your Wi-Fi credentials, API Key, and city latitude/longitude. Compile and flash the code.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'),
  ('a1000000-0000-0000-0000-000000000001', 4, 'Power Optimization and Enclosure Assembly', 'Bypass the devboard onboard AMS1117 regulator by supplying 3.3V from the ultra-low quiescent HT7333 LDO. Snap into a 3D-printed desktop angled stand.', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80')
ON CONFLICT DO NOTHING;

-- Project 1 Code Snippet
INSERT INTO public.project_code_snippets (project_id, title, filename, language, code, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Main Weather Station Firmware', 'esp32_epaper_station.ino', 'cpp', 
'#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <GxEPD2_BW.h>

// Configuration & Credentials
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* apiKey   = "YOUR_OPENWEATHER_API_KEY";
const char* cityId   = "1261481"; // Example: New Delhi

#define uS_TO_S_FACTOR 1000000ULL  // Conversion factor for micro seconds to seconds
#define TIME_TO_SLEEP  1800        // Time ESP32 will sleep (30 minutes)

Adafruit_BME280 bme;
GxEPD2_BW<GxEPD2_290_T94, GxEPD2_290_T94::HEIGHT> display(
  GxEPD2_290_T94(/*CS=*/ 5, /*DC=*/ 17, /*RST=*/ 16, /*BUSY=*/ 4)
);

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  if (!bme.begin(0x76)) {
    Serial.println("BME280 sensor not detected!");
  }

  display.init(115200);
  display.setRotation(1);

  // Connect to Wi-Fi
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
    int httpCode = http.GET();
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);
      outdoorTemp = doc["main"]["temp"];
    }
    http.end();
    WiFi.disconnect(true);
    WiFi.mode(WIFI_OFF);
  }

  // Render to e-Paper
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setTextColor(GxEPD_BLACK);
    display.setTextSize(2);
    display.setCursor(10, 20);
    display.print("VoltNex Weather Station");
    
    display.setTextSize(1);
    display.setCursor(10, 50);
    display.printf("Indoor Temp: %.1f C | Hum: %.1f %%", indoorTemp, indoorHum);
    display.setCursor(10, 75);
    display.printf("Outdoor Temp: %.1f C", outdoorTemp);
    display.setCursor(10, 105);
    display.print("Next sync in 30 mins...");
  } while (display.nextPage());

  display.powerOff();
  Serial.println("Entering Deep Sleep...");
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  esp_deep_sleep_start();
}

void loop() {}', 1)
ON CONFLICT DO NOTHING;

-- Project 2: Obstacle Avoidance Rover (Arduino)
INSERT INTO public.projects (
  id,
  title,
  slug,
  summary,
  description,
  cover_image,
  difficulty,
  estimated_time,
  status,
  featured,
  circuit_diagram_url,
  wiring_notes,
  troubleshooting_notes,
  safety_notes,
  seo_title,
  seo_description
) VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Autonomous Obstacle Avoidance Rover with Ultrasonic Radar',
  'arduino-obstacle-avoidance-rover',
  'Dual-geared mobile robotics platform powered by Arduino Uno and an L298N H-Bridge. Features a pan-scanning ultrasonic sensor on an SG90 micro-servo that sweeps 180 degrees to calculate clear navigation vectors in real-time.',
  '## Autonomous Navigation Architecture\n\nThis project provides a robust foundation for mobile autonomous robotics. Rather than relying on static single-point proximity checks, the front-mounted ultrasonic transducer sweeps a 180-degree radar arc using a sub-miniature servo.\n\n### Navigation Algorithm\n1. Distance threshold is set to 25 cm.\n2. Rover drives forward at pulse-width modulated (PWM) velocity.\n3. Upon obstacle detection within the safety envelope, the rover halts and executes a left and right distance scan.\n4. Compares clearance angles and drives toward the largest open space.\n5. Integrates reverse-and-pivot logic to free trapped wheels.',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  'Beginner',
  '3-4 Hours',
  'published',
  true,
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  'Arduino Pin D9->L298N IN1, D8->IN2, D7->IN3, D6->IN4. ENA and ENB connected to 5V jumpers or PWM pins D5/D10. HC-SR04: Trig->A1, Echo->A2. SG90 Servo Signal->D11. Connect common ground between Arduino and L298N.',
  '- Rover spins in circles: Invert motor polarity on the offending side.\n- Ultrasonic sensor reads 0 cm: Ensure trigger pulse width is at least 10 microseconds.\n- Arduino resets when motors start: Add a 100µF electrolytic decoupling capacitor across motor driver VCC.',
  'Never power high-draw DC gear motors directly from the Arduino 5V regulator pin. Always use a dedicated battery pack through the L298N VCC terminal.',
  'Autonomous Obstacle Avoidance Rover Guide | VoltNex',
  'Step-by-step instructions to wire and code an Arduino obstacle-avoiding mobile robot with ultrasonic radar scanning.'
) ON CONFLICT (slug) DO NOTHING;

-- Project 2 Categories
INSERT INTO public.project_categories (project_id, category_id) VALUES
  ('a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000004'),
  ('a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000005')
ON CONFLICT DO NOTHING;

-- Project 3: LoRa Soil Telemetry Node
INSERT INTO public.projects (
  id,
  title,
  slug,
  summary,
  description,
  cover_image,
  difficulty,
  estimated_time,
  status,
  featured,
  circuit_diagram_url,
  wiring_notes,
  troubleshooting_notes,
  safety_notes,
  seo_title,
  seo_description
) VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'LoRa Long-Range Precision Soil Telemetry Node',
  'lora-soil-telemetry-node',
  'Solar-powered, sub-GHz LoRa telemetry probe monitoring soil moisture, electrical conductivity, and subterranean temperature across a 5km radius without cellular subscriptions.',
  '## Precision Agriculture Node\n\nBuilt for off-grid deployment, this node combines a custom low-power ATmega328P 3.3V architecture with an SX1276 868/915MHz LoRa transceiver.\n\n### Environmental Resistance\nUtilises capacitive frequency sensing instead of resistive probes to prevent galvanic corrosion in moist soils.',
  'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80',
  'Advanced',
  '6-8 Hours',
  'published',
  true,
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
  'SX1276 SPI: SCK->D13, MISO->D12, MOSI->D11, NSS->D10, DIO0->D2. Soil sensor powered via digital pin D4 to avoid continuous current consumption.',
  '- Packet loss over 1km: Ensure antenna ground plane impedance matching is observed (50Ω SMA coax).\n- Excessive sleep current: Ensure ADC is powered down during watchdog sleep.',
  'Always screw on the 868/915MHz antenna before powering up the LoRa module; transmitting without an antenna can reflect RF energy and burn out the power amplifier.',
  'LoRa Soil Telemetry Node Blueprint | VoltNex',
  'Build a long-range LoRa farm telemetry station with capacitive soil sensing, watchdog sleep, and solar charging.'
) ON CONFLICT (slug) DO NOTHING;

-- Project 3 Categories
INSERT INTO public.project_categories (project_id, category_id) VALUES
  ('a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003'),
  ('a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000005'),
  ('a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000006')
ON CONFLICT DO NOTHING;

-- Insert Tutorials
INSERT INTO public.tutorials (
  id,
  title,
  slug,
  summary,
  content,
  cover_image,
  difficulty,
  read_time,
  status,
  featured,
  tags
) VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  'ESP32 FreeRTOS Multitasking: Core Pinning, Queues & Semaphores',
  'esp32-freertos-multitasking-guide',
  'Learn how to leverage both Xtensa cores on your ESP32. Avoid blocking delays, manage concurrency safely with queues and mutexes, and prevent watchdog panics.',
  '# Mastering FreeRTOS on ESP32\n\nThe ESP32 SoC incorporates two 32-bit Xtensa LX6 microprocessors: **PRO_CPU (Protocol CPU, Core 0)** and **APP_CPU (Application CPU, Core 1)**.\n\nWhile standard Arduino `setup()` and `loop()` execute on Core 1 by default, high-performance embedded systems require delegating network tasks, sensor polling, and display refreshes to dedicated RTOS tasks.\n\n```cpp\n// Creating an RTOS Task pinned to Core 0\nxTaskCreatePinnedToCore(\n  sensorTaskCode,\n  "SensorTask",\n  4096,\n  NULL,\n  1,\n  &sensorTaskHandle,\n  0 // Pin to Core 0\n);\n```\n\n## 1. Task Priorities & Preemption\nFreeRTOS uses priority numbers where higher numbers denote higher priority. Always yield or insert `vTaskDelay()` in tight loops to prevent starving the Idle task and triggering the FreeRTOS Task Watchdog Timer (TWDT).',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'Intermediate',
  '12 min read',
  'published',
  true,
  ARRAY['ESP32', 'FreeRTOS', 'C++', 'Embedded Systems', 'Concurrency']
),
(
  'b1000000-0000-0000-0000-000000000002',
  'Demystifying I2C & SPI: Pull-Up Resistors, Clock Speed, and Signal Integrity',
  'i2c-spi-protocol-deep-dive',
  'An electrical engineer guide to debugging serial communications. How to select pull-up resistor values, eliminate bus capacitance ringing, and troubleshoot packet corruption.',
  '# Understanding I2C vs SPI Under the Hood\n\nWhen microcontroller sensors fail to communicate, 90% of the root causes stem from incorrect bus topology or impedance mismatches.\n\n## I2C Bus Physics (Open-Drain)\nBecause I2C lines (SDA, SCL) are open-drain, devices can only pull lines LOW. Pull-up resistors restore the line to HIGH (VCC).\n\n$$\\tau = R_{pullup} \\times C_{bus}$$\n\nIf the total bus capacitance ($C_{bus}$) exceeds 400pF, rise times distort from crisp square waves into rounded exponential curves, causing false clock edge detection.\n\n### Calculating Optimal Pull-Up Values\n- **Standard Mode (100 kHz)**: $R_{min} = (V_{DD} - 0.4V) / 3mA$, $R_{max} \\approx 10k\\Omega$\n- **Fast Mode (400 kHz)**: Recommend $2.2k\\Omega$ to $4.7k\\Omega$\n- **High Noise Environments**: Place a 100nF bypass capacitor adjacent to each sensor VCC pin.',
  'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80',
  'Advanced',
  '15 min read',
  'published',
  true,
  ARRAY['I2C', 'SPI', 'Hardware Debugging', 'Oscilloscopes', 'Signal Integrity']
),
(
  'b1000000-0000-0000-0000-000000000003',
  'Beginner Guide to Microcontroller Interrupts & Debouncing',
  'microcontroller-interrupts-debouncing',
  'Never use delay() in production firmware again. Master external hardware interrupts, volatile variables, and hardware RC debouncing.',
  '# Why Polling Fails in Real-Time Systems\n\nIf your firmware relies on checking button states inside `loop()`, high-speed events like optical rotary encoders or limit switches will frequently be missed during other execution branches.\n\n## Interrupt Service Routines (ISRs)\nAn interrupt forces the CPU to pause execution, store its program counter onto the stack, execute a lightweight ISR, and immediately resume.\n\n### ISR Best Practices\n1. Mark shared global variables as `volatile` to prevent compiler register caching.\n2. Keep ISR execution under 10 microseconds.\n3. Never call blocking functions like `Serial.print()` or `delay()` inside an ISR.',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  'Beginner',
  '8 min read',
  'published',
  false,
  ARRAY['Arduino', 'Interrupts', 'C++', 'Electronics Basics']
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Resources
INSERT INTO public.resources (
  id,
  title,
  slug,
  description,
  file_url,
  file_name,
  file_type,
  file_size_bytes,
  technology,
  status,
  download_count
) VALUES
(
  'd1000000-0000-0000-0000-000000000001',
  'VoltNex Universal Microcontroller Pinout Reference Guide',
  'voltnex-microcontroller-pinout-guide',
  'High-resolution vector printable reference detailing pin capabilities, ADC channels, PWM timers, and I2C/SPI mappings for Arduino Uno, Nano, ESP32-WROOM, and RP2040.',
  'https://voltnex-cdn.local/downloads/VoltNex_MCU_Pinout_Reference_v1.pdf',
  'VoltNex_MCU_Pinout_Reference_v1.pdf',
  'application/pdf',
  4210000,
  'General Electronics',
  'published',
  142
),
(
  'd1000000-0000-0000-0000-000000000002',
  'ESP32 Ultra-Low Power Deep Sleep & Timer Wakeup Template',
  'esp32-deep-sleep-ulp-template',
  'Clean boilerplate C++ code for ESP32 deep sleep, RTC memory variable persistence across wake cycles, and sensor power gate transistor switching.',
  'https://voltnex-cdn.local/downloads/esp32_deep_sleep_boilerplate.ino',
  'esp32_deep_sleep_boilerplate.ino',
  'text/x-c++',
  14300,
  'ESP32',
  'published',
  318
),
(
  'd1000000-0000-0000-0000-000000000003',
  'Obstacle Rover Chassis 3D Printable STL & Laser Cut CAD Bundle',
  'obstacle-rover-cad-stl-bundle',
  'Complete 3D printable mechanical files (.STL) and laser cutting vectors (.DXF) for the VoltNex dual-wheel obstacle avoidance rover platform.',
  'https://voltnex-cdn.local/downloads/voltnex_rover_chassis_cad.zip',
  'voltnex_rover_chassis_cad.zip',
  'application/zip',
  18450000,
  'Robotics',
  'published',
  89
),
(
  'd1000000-0000-0000-0000-000000000004',
  'LoRa Sensor Node KiCad 8 Schematic & PCB Layout Files',
  'lora-sensor-node-kicad-project',
  'Complete production-ready KiCad PCB design with copper pour thermal relief, 50-ohm RF trace geometry, and Bill of Materials.',
  'https://voltnex-cdn.local/downloads/voltnex_lora_kicad8.zip',
  'voltnex_lora_kicad8.zip',
  'application/zip',
  7620000,
  'Embedded Systems',
  'published',
  94
)
ON CONFLICT (slug) DO NOTHING;
