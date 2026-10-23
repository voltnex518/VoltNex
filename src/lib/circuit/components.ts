import type { CircuitComponentDefinition, ComponentCategory } from '../../types/circuit';

export const COMPONENT_CATEGORIES: { id: ComponentCategory; name: string; icon: string }[] = [
  { id: 'microcontrollers', name: 'Microcontrollers', icon: 'Cpu' },
  { id: 'power', name: 'Power Sources', icon: 'Zap' },
  { id: 'passive', name: 'Passives', icon: 'Sliders' },
  { id: 'semiconductors', name: 'Semiconductors', icon: 'Activity' },
  { id: 'inputs', name: 'Inputs & Controls', icon: 'ToggleRight' },
  { id: 'outputs', name: 'Actuators & Outputs', icon: 'Volume2' },
  { id: 'sensors', name: 'Sensors & Displays', icon: 'Radio' },
];

export const CATEGORIES = COMPONENT_CATEGORIES;

export const COMPONENT_DEFINITIONS: CircuitComponentDefinition[] = [
  // --- MICROCONTROLLERS ---
  {
    id: 'arduino_uno',
    name: 'Arduino Uno R3',
    category: 'microcontrollers',
    description: 'ATmega328P 8-bit AVR microcontroller development board with 14 digital I/O pins, 6 analog inputs, 16MHz clock, and 5V operating rail.',
    symbolType: 'mcu_board',
    width: 280,
    height: 200,
    defaultRefPrefix: 'U',
    defaultProperties: { model: 'Uno R3', clock: '16MHz', vcc: 5 },
    pins: [
      // Top header row (Digital & I2C)
      { id: 'scl', name: 'SCL', x: 50, y: 15, type: 'signal', description: 'I2C Clock Line', aliases: ['SCL'], gpio: 'A5', physicalNumber: 1 },
      { id: 'sda', name: 'SDA', x: 62, y: 15, type: 'signal', description: 'I2C Data Line', aliases: ['SDA'], gpio: 'A4', physicalNumber: 2 },
      { id: 'aref', name: 'AREF', x: 74, y: 15, type: 'passive', description: 'Analog Reference Voltage', aliases: ['AREF'], physicalNumber: 3 },
      { id: 'gnd_top', name: 'GND', x: 86, y: 15, type: 'ground', description: 'Digital Ground', aliases: ['GND'], physicalNumber: 4 },
      { id: 'd13', name: 'D13', x: 98, y: 15, type: 'digital', description: 'SPI SCK / Built-in LED', aliases: ['SCK', 'LED_BUILTIN'], gpio: '13', physicalNumber: 5 },
      { id: 'd12', name: 'D12', x: 110, y: 15, type: 'digital', description: 'SPI MISO (Master In Slave Out)', aliases: ['MISO'], gpio: '12', physicalNumber: 6 },
      { id: 'd11', name: 'D11~', x: 122, y: 15, type: 'digital', description: 'PWM Timer2A / SPI MOSI', aliases: ['MOSI', 'PWM'], gpio: '11', physicalNumber: 7 },
      { id: 'd10', name: 'D10~', x: 134, y: 15, type: 'digital', description: 'PWM Timer1B / SPI SS', aliases: ['SS', 'PWM'], gpio: '10', physicalNumber: 8 },
      { id: 'd9', name: 'D9~', x: 146, y: 15, type: 'digital', description: 'PWM Timer1A', aliases: ['PWM'], gpio: '9', physicalNumber: 9 },
      { id: 'd8', name: 'D8', x: 158, y: 15, type: 'digital', description: 'Digital I/O Pin 8', gpio: '8', physicalNumber: 10 },
      // 14px authentic gap between D8 and D7
      { id: 'd7', name: 'D7', x: 182, y: 15, type: 'digital', description: 'Digital I/O Pin 7', gpio: '7', physicalNumber: 11 },
      { id: 'd6', name: 'D6~', x: 194, y: 15, type: 'digital', description: 'PWM Timer0A', aliases: ['PWM'], gpio: '6', physicalNumber: 12 },
      { id: 'd5', name: 'D5~', x: 206, y: 15, type: 'digital', description: 'PWM Timer0B', aliases: ['PWM'], gpio: '5', physicalNumber: 13 },
      { id: 'd4', name: 'D4', x: 218, y: 15, type: 'digital', description: 'Digital I/O Pin 4', gpio: '4', physicalNumber: 14 },
      { id: 'd3', name: 'D3~', x: 230, y: 15, type: 'digital', description: 'PWM Timer2B / Ext Interrupt 1', aliases: ['PWM', 'INT1'], gpio: '3', physicalNumber: 15 },
      { id: 'd2', name: 'D2', x: 242, y: 15, type: 'digital', description: 'Digital I/O / Ext Interrupt 0', aliases: ['INT0'], gpio: '2', physicalNumber: 16 },
      { id: 'd1', name: 'D1/TX', x: 254, y: 15, type: 'digital', description: 'Serial Transmit (TXD)', aliases: ['TX'], gpio: '1', physicalNumber: 17 },
      { id: 'd0', name: 'D0/RX', x: 266, y: 15, type: 'digital', description: 'Serial Receive (RXD)', aliases: ['RX'], gpio: '0', physicalNumber: 18 },

      // Bottom header row (Power & Analog In)
      { id: 'nc', name: 'NC', x: 62, y: 185, type: 'passive', description: 'Not Connected', physicalNumber: 19 },
      { id: 'ioref', name: 'IOREF', x: 74, y: 185, type: 'power', description: 'I/O Reference Voltage (5V)', aliases: ['IOREF'], physicalNumber: 20 },
      { id: 'reset', name: 'RESET', x: 86, y: 185, type: 'signal', description: 'Active-Low MCU Reset', aliases: ['RST'], physicalNumber: 21 },
      { id: 'p3v3', name: '3.3V', x: 98, y: 185, type: 'power', description: '+3.3V Regulated Output (50mA max)', aliases: ['3V3'], physicalNumber: 22 },
      { id: 'p5v', name: '5V', x: 110, y: 185, type: 'power', description: '+5.0V Main Power Rail', aliases: ['VCC', '5V'], physicalNumber: 23 },
      { id: 'gnd_bot1', name: 'GND', x: 122, y: 185, type: 'ground', description: 'Power Ground Return 1', aliases: ['GND'], physicalNumber: 24 },
      { id: 'gnd_bot2', name: 'GND', x: 134, y: 185, type: 'ground', description: 'Power Ground Return 2', aliases: ['GND'], physicalNumber: 25 },
      { id: 'vin', name: 'VIN', x: 146, y: 185, type: 'power', description: 'Raw DC Input (7V - 12V)', aliases: ['VIN', 'RAW'], physicalNumber: 26 },

      { id: 'a0', name: 'A0', x: 182, y: 185, type: 'analog', description: 'Analog Input 0 (10-bit ADC)', gpio: '14', physicalNumber: 27 },
      { id: 'a1', name: 'A1', x: 194, y: 185, type: 'analog', description: 'Analog Input 1 (10-bit ADC)', gpio: '15', physicalNumber: 28 },
      { id: 'a2', name: 'A2', x: 206, y: 185, type: 'analog', description: 'Analog Input 2 (10-bit ADC)', gpio: '16', physicalNumber: 29 },
      { id: 'a3', name: 'A3', x: 218, y: 185, type: 'analog', description: 'Analog Input 3 (10-bit ADC)', gpio: '17', physicalNumber: 30 },
      { id: 'a4', name: 'A4/SDA', x: 230, y: 185, type: 'analog', description: 'Analog In 4 / I2C SDA', aliases: ['SDA'], gpio: '18', physicalNumber: 31 },
      { id: 'a5', name: 'A5/SCL', x: 242, y: 185, type: 'analog', description: 'Analog In 5 / I2C SCL', aliases: ['SCL'], gpio: '19', physicalNumber: 32 },
    ],
  },
  {
    id: 'esp32_devkit',
    name: 'ESP32 DevKit V1 (30-Pin)',
    category: 'microcontrollers',
    description: 'Tensilica Xtensa Dual-Core 32-bit LX6 240MHz SoC with integrated 802.11 b/g/n Wi-Fi and Bluetooth 4.2 BR/EDR/BLE.',
    symbolType: 'mcu_board',
    width: 250,
    height: 180,
    defaultRefPrefix: 'U',
    defaultProperties: { model: 'ESP-WROOM-32', vcc: 3.3 },
    pins: [
      // Top header row (Pins 1 to 15)
      { id: 'p3v3', name: '3V3', x: 30, y: 15, type: 'power', description: '+3.3V Regulated Rail', aliases: ['3V3'], physicalNumber: 1 },
      { id: 'en', name: 'EN', x: 44, y: 15, type: 'signal', description: 'Chip Enable / Active-High Reset', aliases: ['RST'], physicalNumber: 2 },
      { id: 'd36', name: 'VP', x: 58, y: 15, type: 'analog', description: 'GPIO36 / SENSOR_VP / ADC1_CH0', gpio: '36', physicalNumber: 3 },
      { id: 'd39', name: 'VN', x: 72, y: 15, type: 'analog', description: 'GPIO39 / SENSOR_VN / ADC1_CH3', gpio: '39', physicalNumber: 4 },
      { id: 'd34', name: 'D34', x: 86, y: 15, type: 'analog', description: 'GPIO34 / ADC1_CH6 (Input Only)', gpio: '34', physicalNumber: 5 },
      { id: 'd35', name: 'D35', x: 100, y: 15, type: 'analog', description: 'GPIO35 / ADC1_CH7 (Input Only)', gpio: '35', physicalNumber: 6 },
      { id: 'd32', name: 'D32', x: 114, y: 15, type: 'digital', description: 'GPIO32 / Touch9 / ADC1_CH4', gpio: '32', physicalNumber: 7 },
      { id: 'd33', name: 'D33', x: 128, y: 15, type: 'digital', description: 'GPIO33 / Touch8 / ADC1_CH5', gpio: '33', physicalNumber: 8 },
      { id: 'd25', name: 'D25', x: 142, y: 15, type: 'digital', description: 'GPIO25 / DAC1 / ADC2_CH8', gpio: '25', physicalNumber: 9 },
      { id: 'd26', name: 'D26', x: 156, y: 15, type: 'digital', description: 'GPIO26 / DAC2 / ADC2_CH9', gpio: '26', physicalNumber: 10 },
      { id: 'd27', name: 'D27', x: 170, y: 15, type: 'digital', description: 'GPIO27 / Touch7 / ADC2_CH7', gpio: '27', physicalNumber: 11 },
      { id: 'd14', name: 'D14', x: 184, y: 15, type: 'digital', description: 'GPIO14 / Touch6 / HSPI_CLK', gpio: '14', physicalNumber: 12 },
      { id: 'd12', name: 'D12', x: 198, y: 15, type: 'digital', description: 'GPIO12 / Touch5 / HSPI_MISO', gpio: '12', physicalNumber: 13 },
      { id: 'd13', name: 'D13', x: 212, y: 15, type: 'digital', description: 'GPIO13 / Touch4 / HSPI_MOSI', gpio: '13', physicalNumber: 14 },
      { id: 'gnd', name: 'GND', x: 226, y: 15, type: 'ground', description: 'Common Ground Return', aliases: ['GND'], physicalNumber: 15 },

      // Bottom header row (Pins 16 to 30)
      { id: 'vin', name: 'VIN', x: 30, y: 165, type: 'power', description: '5V USB / External Input Rail', aliases: ['5V', 'VBUS'], physicalNumber: 16 },
      { id: 'gnd_bot', name: 'GND', x: 44, y: 165, type: 'ground', description: 'Ground Return 2', aliases: ['GND'], physicalNumber: 17 },
      { id: 'd15', name: 'D15', x: 58, y: 165, type: 'digital', description: 'GPIO15 / Touch3 / HSPI_CS', gpio: '15', physicalNumber: 18 },
      { id: 'd2', name: 'D2', x: 72, y: 165, type: 'digital', description: 'GPIO2 / Touch2 / Built-in Blue LED', gpio: '2', physicalNumber: 19 },
      { id: 'd4', name: 'D4', x: 86, y: 165, type: 'digital', description: 'GPIO4 / Touch0 / ADC2_CH0', gpio: '4', physicalNumber: 20 },
      { id: 'rx2', name: 'RX2', x: 100, y: 165, type: 'digital', description: 'GPIO16 / UART2 RX', gpio: '16', physicalNumber: 21 },
      { id: 'tx2', name: 'TX2', x: 114, y: 165, type: 'digital', description: 'GPIO17 / UART2 TX', gpio: '17', physicalNumber: 22 },
      { id: 'd5', name: 'D5', x: 128, y: 165, type: 'digital', description: 'GPIO5 / VSPI_CS', gpio: '5', physicalNumber: 23 },
      { id: 'd18', name: 'D18', x: 142, y: 165, type: 'digital', description: 'GPIO18 / VSPI_SCK', gpio: '18', physicalNumber: 24 },
      { id: 'd19', name: 'D19', x: 156, y: 165, type: 'digital', description: 'GPIO19 / VSPI_MISO', gpio: '19', physicalNumber: 25 },
      { id: 'd21', name: 'D21', x: 170, y: 165, type: 'digital', description: 'GPIO21 / I2C SDA', aliases: ['SDA'], gpio: '21', physicalNumber: 26 },
      { id: 'rx0', name: 'RX0', x: 184, y: 165, type: 'digital', description: 'GPIO3 / UART0 RX / Serial Debug', gpio: '3', physicalNumber: 27 },
      { id: 'tx0', name: 'TX0', x: 198, y: 165, type: 'digital', description: 'GPIO1 / UART0 TX / Serial Debug', gpio: '1', physicalNumber: 28 },
      { id: 'd22', name: 'D22', x: 212, y: 165, type: 'digital', description: 'GPIO22 / I2C SCL', aliases: ['SCL'], gpio: '22', physicalNumber: 29 },
      { id: 'd23', name: 'D23', x: 226, y: 165, type: 'digital', description: 'GPIO23 / VSPI_MOSI', gpio: '23', physicalNumber: 30 },
    ],
  },
  {
    id: 'esp8266_nodemcu',
    name: 'NodeMCU ESP8266 (ESP-12E)',
    category: 'microcontrollers',
    description: 'Compact 80MHz/160MHz 32-bit Wi-Fi development board with integrated TCP/IP stack and GPIO breakout.',
    symbolType: 'mcu_board',
    width: 250,
    height: 180,
    defaultRefPrefix: 'U',
    defaultProperties: { model: 'ESP-12E', vcc: 3.3 },
    pins: [
      // Top header row (Pins 1 to 15)
      { id: 'a0', name: 'A0', x: 30, y: 15, type: 'analog', description: 'ADC0 Analog Input (1.0V max)', gpio: 'A0', physicalNumber: 1 },
      { id: 'rsv1', name: 'RSV', x: 44, y: 15, type: 'passive', description: 'Reserved Pin', physicalNumber: 2 },
      { id: 'rsv2', name: 'RSV', x: 58, y: 15, type: 'passive', description: 'Reserved Pin', physicalNumber: 3 },
      { id: 'sd3', name: 'SD3', x: 72, y: 15, type: 'digital', description: 'GPIO10 / SPI Flash', gpio: '10', physicalNumber: 4 },
      { id: 'sd2', name: 'SD2', x: 86, y: 15, type: 'digital', description: 'GPIO9 / SPI Flash', gpio: '9', physicalNumber: 5 },
      { id: 'sd1', name: 'SD1', x: 100, y: 15, type: 'digital', description: 'SPI MOSI Flash', physicalNumber: 6 },
      { id: 'cmd', name: 'CMD', x: 114, y: 15, type: 'digital', description: 'SPI Chip Select', physicalNumber: 7 },
      { id: 'sd0', name: 'SD0', x: 128, y: 15, type: 'digital', description: 'SPI MISO Flash', physicalNumber: 8 },
      { id: 'clk', name: 'CLK', x: 142, y: 15, type: 'digital', description: 'SPI Clock Flash', physicalNumber: 9 },
      { id: 'gnd_top', name: 'GND', x: 156, y: 15, type: 'ground', description: 'Ground Return', aliases: ['GND'], physicalNumber: 10 },
      { id: 'p3v3_top', name: '3V3', x: 170, y: 15, type: 'power', description: '+3.3V Power Rail', aliases: ['3V3'], physicalNumber: 11 },
      { id: 'en', name: 'EN', x: 184, y: 15, type: 'signal', description: 'Chip Enable (Active-High)', aliases: ['CH_PD'], physicalNumber: 12 },
      { id: 'rst', name: 'RST', x: 198, y: 15, type: 'signal', description: 'Active-Low MCU Reset', aliases: ['RST'], physicalNumber: 13 },
      { id: 'gnd_top2', name: 'GND', x: 212, y: 15, type: 'ground', description: 'Ground Return 2', aliases: ['GND'], physicalNumber: 14 },
      { id: 'vin', name: 'VIN', x: 226, y: 15, type: 'power', description: '5V USB / DC In Power', aliases: ['VIN', '5V'], physicalNumber: 15 },

      // Bottom header row (Pins 16 to 30)
      { id: 'd0', name: 'D0', x: 30, y: 165, type: 'digital', description: 'GPIO16 / Deep Sleep Wake', gpio: '16', physicalNumber: 16 },
      { id: 'd1', name: 'D1', x: 44, y: 165, type: 'digital', description: 'GPIO5 / I2C SCL', aliases: ['SCL'], gpio: '5', physicalNumber: 17 },
      { id: 'd2', name: 'D2', x: 58, y: 165, type: 'digital', description: 'GPIO4 / I2C SDA', aliases: ['SDA'], gpio: '4', physicalNumber: 18 },
      { id: 'd3', name: 'D3', x: 72, y: 165, type: 'digital', description: 'GPIO0 / Flash Mode Button', gpio: '0', physicalNumber: 19 },
      { id: 'd4', name: 'D4', x: 86, y: 165, type: 'digital', description: 'GPIO2 / Built-in LED / Boot', gpio: '2', physicalNumber: 20 },
      { id: 'p3v3', name: '3V3', x: 100, y: 165, type: 'power', description: '+3.3V Power Rail', aliases: ['3V3'], physicalNumber: 21 },
      { id: 'gnd_bot', name: 'GND', x: 114, y: 165, type: 'ground', description: 'Ground Return', aliases: ['GND'], physicalNumber: 22 },
      { id: 'd5', name: 'D5', x: 128, y: 165, type: 'digital', description: 'GPIO14 / SPI SCK', gpio: '14', physicalNumber: 23 },
      { id: 'd6', name: 'D6', x: 142, y: 165, type: 'digital', description: 'GPIO12 / SPI MISO', gpio: '12', physicalNumber: 24 },
      { id: 'd7', name: 'D7', x: 156, y: 165, type: 'digital', description: 'GPIO13 / SPI MOSI', gpio: '13', physicalNumber: 25 },
      { id: 'd8', name: 'D8', x: 170, y: 165, type: 'digital', description: 'GPIO15 / SPI CS / Boot', gpio: '15', physicalNumber: 26 },
      { id: 'rx', name: 'RX', x: 184, y: 165, type: 'digital', description: 'GPIO3 / UART0 RX / Flash', gpio: '3', physicalNumber: 27 },
      { id: 'tx', name: 'TX', x: 198, y: 165, type: 'digital', description: 'GPIO1 / UART0 TX / Flash', gpio: '1', physicalNumber: 28 },
      { id: 'gnd', name: 'GND', x: 212, y: 165, type: 'ground', description: 'Ground Return 3', aliases: ['GND'], physicalNumber: 29 },
      { id: 'p3v3_bot', name: '3V3', x: 226, y: 165, type: 'power', description: '+3.3V Power Rail 2', aliases: ['3V3'], physicalNumber: 30 },
    ],
  },

  // --- POWER SOURCES ---
  {
    id: 'battery_9v',
    name: '9V Battery',
    category: 'power',
    description: 'Standard 9V PP3 alkaline battery with positive snap and negative snap.',
    symbolType: 'battery',
    width: 80,
    height: 110,
    defaultRefPrefix: 'BT',
    defaultProperties: { voltage: 9.0, capacity_mah: 550 },
    pins: [
      { id: 'pos', name: '+', x: 25, y: 0, type: 'power', description: '+9V DC' },
      { id: 'neg', name: '−', x: 55, y: 0, type: 'ground', description: '0V / Return' },
    ],
  },
  {
    id: 'power_supply_dc',
    name: 'DC Power Supply',
    category: 'power',
    description: 'Regulated benchtop DC supply with configurable voltage and current limit.',
    symbolType: 'power_supply',
    width: 100,
    height: 70,
    defaultRefPrefix: 'PS',
    defaultProperties: { voltage: 5.0, maxCurrentA: 2.0 },
    pins: [
      { id: 'vcc', name: 'VCC', x: 25, y: 70, type: 'power', description: '+ Voltage Rail' },
      { id: 'gnd', name: 'GND', x: 75, y: 70, type: 'ground', description: 'Ground Return' },
    ],
  },
  {
    id: 'ground',
    name: 'Ground (GND)',
    category: 'power',
    description: '0V reference ground potential symbol.',
    symbolType: 'ground_symbol',
    width: 50,
    height: 50,
    defaultRefPrefix: 'GND',
    defaultProperties: {},
    pins: [
      { id: 'gnd', name: 'GND', x: 25, y: 0, type: 'ground', description: '0V Common Ground' },
    ],
  },
  {
    id: 'voltage_source',
    name: '5V Voltage Rail',
    category: 'power',
    description: 'Constant 5.0V positive voltage source pin.',
    symbolType: 'vcc_symbol',
    width: 50,
    height: 50,
    defaultRefPrefix: 'VCC',
    defaultProperties: { voltage: 5.0 },
    pins: [
      { id: 'vcc', name: '+5V', x: 25, y: 50, type: 'power', description: '+5.0V Rail' },
    ],
  },

  // --- PASSIVE COMPONENTS ---
  {
    id: 'resistor',
    name: 'Resistor',
    category: 'passive',
    description: 'Linear two-terminal passive component that resists electric current flow.',
    symbolType: 'resistor',
    width: 80,
    height: 40,
    defaultRefPrefix: 'R',
    defaultProperties: { resistance: 220, unit: 'Ω', tolerance: '5%' },
    pins: [
      { id: 'p1', name: '1', x: 0, y: 20, type: 'passive' },
      { id: 'p2', name: '2', x: 80, y: 20, type: 'passive' },
    ],
  },
  {
    id: 'potentiometer',
    name: 'Potentiometer',
    category: 'passive',
    description: 'Three-terminal adjustable voltage divider and variable resistor.',
    symbolType: 'potentiometer',
    width: 80,
    height: 80,
    defaultRefPrefix: 'VR',
    defaultProperties: { totalResistance: 10000, valuePercent: 50 },
    pins: [
      { id: 't1', name: '1', x: 15, y: 80, type: 'passive', description: 'Terminal 1' },
      { id: 'wiper', name: 'W', x: 40, y: 80, type: 'passive', description: 'Wiper / Center' },
      { id: 't2', name: '2', x: 65, y: 80, type: 'passive', description: 'Terminal 2' },
    ],
  },
  {
    id: 'capacitor_ceramic',
    name: 'Ceramic Capacitor',
    category: 'passive',
    description: 'Non-polarized capacitor for high-frequency bypass and decoupling.',
    symbolType: 'capacitor',
    width: 70,
    height: 50,
    defaultRefPrefix: 'C',
    defaultProperties: { capacitance: 100, unit: 'nF' },
    pins: [
      { id: 'p1', name: '1', x: 0, y: 25, type: 'passive' },
      { id: 'p2', name: '2', x: 70, y: 25, type: 'passive' },
    ],
  },
  {
    id: 'capacitor_electrolytic',
    name: 'Electrolytic Capacitor',
    category: 'passive',
    description: 'Polarized aluminum capacitor with high capacitance for power smoothing.',
    symbolType: 'capacitor_polarized',
    width: 70,
    height: 60,
    defaultRefPrefix: 'C',
    defaultProperties: { capacitance: 10, unit: 'µF', voltageRating: '25V' },
    pins: [
      { id: 'pos', name: '+', x: 0, y: 30, type: 'passive', description: 'Anode (+)' },
      { id: 'neg', name: '−', x: 70, y: 30, type: 'passive', description: 'Cathode (-)' },
    ],
  },
  {
    id: 'inductor',
    name: 'Inductor',
    category: 'passive',
    description: 'Two-terminal passive component that resists changes in current.',
    symbolType: 'inductor',
    width: 80,
    height: 40,
    defaultRefPrefix: 'L',
    defaultProperties: { inductance: 100, unit: 'µH' },
    pins: [
      { id: 'p1', name: '1', x: 0, y: 20, type: 'passive' },
      { id: 'p2', name: '2', x: 80, y: 20, type: 'passive' },
    ],
  },

  // --- SEMICONDUCTORS ---
  {
    id: 'led',
    name: 'LED (Light Emitting Diode)',
    category: 'semiconductors',
    description: 'Polarized semiconductor diode that emits light when forward biased.',
    symbolType: 'led',
    width: 60,
    height: 70,
    defaultRefPrefix: 'D',
    defaultProperties: { color: 'red', forwardVoltage: 2.0, maxCurrentmA: 30 },
    pins: [
      { id: 'anode', name: 'A (+)', x: 15, y: 70, type: 'passive', description: 'Anode (Long leg)' },
      { id: 'cathode', name: 'K (−)', x: 45, y: 70, type: 'passive', description: 'Cathode (Flat side)' },
    ],
  },
  {
    id: 'rgb_led',
    name: 'RGB LED (Common Cathode)',
    category: 'semiconductors',
    description: 'Tri-color light emitting diode with red, green, blue anodes and common ground.',
    symbolType: 'rgb_led',
    width: 80,
    height: 80,
    defaultRefPrefix: 'D',
    defaultProperties: { forwardVoltage: 2.1 },
    pins: [
      { id: 'r', name: 'R', x: 15, y: 80, type: 'passive', description: 'Red Anode' },
      { id: 'gnd', name: 'GND', x: 32, y: 80, type: 'ground', description: 'Common Cathode' },
      { id: 'g', name: 'G', x: 49, y: 80, type: 'passive', description: 'Green Anode' },
      { id: 'b', name: 'B', x: 66, y: 80, type: 'passive', description: 'Blue Anode' },
    ],
  },
  {
    id: 'diode',
    name: 'Diode (1N4007)',
    category: 'semiconductors',
    description: 'One-way semiconductor rectifier diode prevents reverse current.',
    symbolType: 'diode',
    width: 80,
    height: 40,
    defaultRefPrefix: 'D',
    defaultProperties: { forwardVoltage: 0.7, maxCurrentA: 1.0 },
    pins: [
      { id: 'anode', name: 'A (+)', x: 0, y: 20, type: 'passive', description: 'Anode' },
      { id: 'cathode', name: 'K (−)', x: 80, y: 20, type: 'passive', description: 'Cathode (Silver band)' },
    ],
  },
  {
    id: 'transistor_npn',
    name: 'NPN Transistor (2N2222)',
    category: 'semiconductors',
    description: 'Bipolar junction transistor for current amplification and switching.',
    symbolType: 'bjt_npn',
    width: 70,
    height: 70,
    defaultRefPrefix: 'Q',
    defaultProperties: { hfe: 100, vbe: 0.7 },
    pins: [
      { id: 'c', name: 'C', x: 55, y: 10, type: 'passive', description: 'Collector' },
      { id: 'b', name: 'B', x: 10, y: 35, type: 'signal', description: 'Base' },
      { id: 'e', name: 'E', x: 55, y: 60, type: 'passive', description: 'Emitter' },
    ],
  },
  {
    id: 'mosfet_n',
    name: 'N-Channel MOSFET (IRF540N)',
    category: 'semiconductors',
    description: 'Voltage-controlled switch with low on-resistance for high-power DC loads.',
    symbolType: 'mosfet_n',
    width: 70,
    height: 70,
    defaultRefPrefix: 'Q',
    defaultProperties: { vgsTh: 3.0, rdsOn: 0.044 },
    pins: [
      { id: 'd', name: 'D', x: 55, y: 10, type: 'passive', description: 'Drain' },
      { id: 'g', name: 'G', x: 10, y: 35, type: 'signal', description: 'Gate' },
      { id: 's', name: 'S', x: 55, y: 60, type: 'passive', description: 'Source' },
    ],
  },

  // --- INPUTS & CONTROLS ---
  {
    id: 'push_button',
    name: 'Tactile Push Button',
    category: 'inputs',
    description: 'Momentary normally-open push button switch. Connects pins while pressed.',
    symbolType: 'button',
    width: 60,
    height: 60,
    defaultRefPrefix: 'SW',
    defaultProperties: { isMomentary: true },
    pins: [
      { id: 'p1', name: '1', x: 0, y: 30, type: 'passive', description: 'Terminal 1' },
      { id: 'p2', name: '2', x: 60, y: 30, type: 'passive', description: 'Terminal 2' },
    ],
  },
  {
    id: 'spst_switch',
    name: 'SPST Toggle Switch',
    category: 'inputs',
    description: 'Single-Pole Single-Throw toggle switch. Click to toggle open/closed state.',
    symbolType: 'switch',
    width: 70,
    height: 50,
    defaultRefPrefix: 'SW',
    defaultProperties: { isClosed: false },
    pins: [
      { id: 'p1', name: '1', x: 0, y: 25, type: 'passive', description: 'Input' },
      { id: 'p2', name: '2', x: 70, y: 25, type: 'passive', description: 'Output' },
    ],
  },
  {
    id: 'ldr_sensor',
    name: 'Photoresistor (LDR)',
    category: 'inputs',
    description: 'Cadmium sulfide light dependent resistor. Resistance varies with light.',
    symbolType: 'ldr',
    width: 70,
    height: 60,
    defaultRefPrefix: 'LDR',
    defaultProperties: { lux: 250, darkR: 100000, lightR: 400 },
    pins: [
      { id: 'p1', name: '1', x: 0, y: 30, type: 'passive' },
      { id: 'p2', name: '2', x: 70, y: 30, type: 'passive' },
    ],
  },
  {
    id: 'temp_sensor',
    name: 'TMP36 Temperature Sensor',
    category: 'inputs',
    description: 'Analog linear temperature sensor providing 10mV/°C voltage output.',
    symbolType: 'ic_analog',
    width: 70,
    height: 70,
    defaultRefPrefix: 'U',
    defaultProperties: { tempC: 25.0 },
    pins: [
      { id: 'vcc', name: 'VCC', x: 15, y: 70, type: 'power', description: '2.7V - 5.5V' },
      { id: 'vout', name: 'VOUT', x: 35, y: 70, type: 'analog', description: '10mV/°C output' },
      { id: 'gnd', name: 'GND', x: 55, y: 70, type: 'ground' },
    ],
  },

  // --- ACTUATORS & OUTPUTS ---
  {
    id: 'piezo_buzzer',
    name: 'Active Piezo Buzzer',
    category: 'outputs',
    description: 'Generates audible sound when energized with 3V - 12V DC.',
    symbolType: 'buzzer',
    width: 70,
    height: 70,
    defaultRefPrefix: 'BZ',
    defaultProperties: { toneHz: 2700, ratedV: 5 },
    pins: [
      { id: 'pos', name: '+', x: 20, y: 70, type: 'passive', description: 'Positive (+)' },
      { id: 'neg', name: '−', x: 50, y: 70, type: 'ground', description: 'Negative (-)' },
    ],
  },
  {
    id: 'dc_motor',
    name: 'DC Hobby Motor',
    category: 'outputs',
    description: 'Permanent-magnet DC motor that spins when powered.',
    symbolType: 'motor_dc',
    width: 80,
    height: 80,
    defaultRefPrefix: 'M',
    defaultProperties: { rpm: 150, ratedVoltage: 5 },
    pins: [
      { id: 'pos', name: '+', x: 20, y: 80, type: 'passive' },
      { id: 'neg', name: '−', x: 60, y: 80, type: 'passive' },
    ],
  },
  {
    id: 'servo_motor',
    name: 'Micro Servo SG90',
    category: 'outputs',
    description: 'Positional 180° servo motor controlled via PWM pulses.',
    symbolType: 'servo',
    width: 80,
    height: 80,
    defaultRefPrefix: 'SV',
    defaultProperties: { angle: 90 },
    pins: [
      { id: 'gnd', name: 'GND', x: 20, y: 80, type: 'ground', description: 'Brown wire' },
      { id: 'vcc', name: '5V', x: 40, y: 80, type: 'power', description: 'Red wire' },
      { id: 'pwm', name: 'PWM', x: 60, y: 80, type: 'signal', description: 'Orange wire' },
    ],
  },
  {
    id: 'relay_module',
    name: '5V Relay Module',
    category: 'outputs',
    description: 'Optocoupled electromechanical relay with status LED and flyback diode.',
    symbolType: 'relay',
    width: 100,
    height: 80,
    defaultRefPrefix: 'K',
    defaultProperties: { trigger: 'LOW' },
    pins: [
      // Control side
      { id: 'vcc', name: 'VCC', x: 15, y: 0, type: 'power' },
      { id: 'gnd', name: 'GND', x: 35, y: 0, type: 'ground' },
      { id: 'in', name: 'IN', x: 55, y: 0, type: 'signal' },
      // High voltage load side
      { id: 'no', name: 'NO', x: 20, y: 80, type: 'passive', description: 'Normally Open' },
      { id: 'com', name: 'COM', x: 50, y: 80, type: 'passive', description: 'Common' },
      { id: 'nc', name: 'NC', x: 80, y: 80, type: 'passive', description: 'Normally Closed' },
    ],
  },

  // --- SENSORS & DISPLAYS ---
  {
    id: 'hc_sr04',
    name: 'HC-SR04 Ultrasonic Sensor',
    category: 'sensors',
    description: '40kHz non-contact distance measurement module ranging from 2cm to 400cm.',
    symbolType: 'ultrasonic',
    width: 110,
    height: 75,
    defaultRefPrefix: 'SEN',
    defaultProperties: { distanceCm: 45 },
    pins: [
      { id: 'vcc', name: 'VCC', x: 20, y: 75, type: 'power' },
      { id: 'trig', name: 'TRIG', x: 42, y: 75, type: 'digital' },
      { id: 'echo', name: 'ECHO', x: 65, y: 75, type: 'digital' },
      { id: 'gnd', name: 'GND', x: 88, y: 75, type: 'ground' },
    ],
  },
  {
    id: 'dht11',
    name: 'DHT11 Humidity & Temp',
    category: 'sensors',
    description: 'Digital sensor for relative humidity (20-90%) and temperature (0-50°C).',
    symbolType: 'sensor_module',
    width: 75,
    height: 85,
    defaultRefPrefix: 'SEN',
    defaultProperties: { tempC: 24, humidityPercent: 55 },
    pins: [
      { id: 'vcc', name: 'VCC', x: 15, y: 85, type: 'power' },
      { id: 'data', name: 'DATA', x: 32, y: 85, type: 'signal' },
      { id: 'nc', name: 'NC', x: 49, y: 85, type: 'passive' },
      { id: 'gnd', name: 'GND', x: 65, y: 85, type: 'ground' },
    ],
  },
  {
    id: 'pir_sensor',
    name: 'PIR Motion Sensor (HC-SR501)',
    category: 'sensors',
    description: 'Passive infrared sensor detects human and motion signatures.',
    symbolType: 'pir',
    width: 85,
    height: 75,
    defaultRefPrefix: 'SEN',
    defaultProperties: { motionDetected: false },
    pins: [
      { id: 'vcc', name: 'VCC', x: 20, y: 75, type: 'power', description: '4.5V - 20V' },
      { id: 'out', name: 'OUT', x: 42, y: 75, type: 'digital', description: '3.3V High TTL' },
      { id: 'gnd', name: 'GND', x: 65, y: 75, type: 'ground' },
    ],
  },
  {
    id: 'rc522_rfid',
    name: 'RFID RC522 Module',
    category: 'sensors',
    description: '13.56MHz contactless SPI RFID reader/writer module.',
    symbolType: 'rfid',
    width: 110,
    height: 85,
    defaultRefPrefix: 'RFID',
    defaultProperties: {},
    pins: [
      { id: 'sda', name: 'SDA', x: 15, y: 85, type: 'digital' },
      { id: 'sck', name: 'SCK', x: 28, y: 85, type: 'digital' },
      { id: 'mosi', name: 'MOSI', x: 41, y: 85, type: 'digital' },
      { id: 'miso', name: 'MISO', x: 54, y: 85, type: 'digital' },
      { id: 'irq', name: 'IRQ', x: 67, y: 85, type: 'digital' },
      { id: 'gnd', name: 'GND', x: 80, y: 85, type: 'ground' },
      { id: 'rst', name: 'RST', x: 93, y: 85, type: 'signal' },
      { id: 'p3v3', name: '3.3V', x: 104, y: 85, type: 'power' },
    ],
  },
  {
    id: 'oled_i2c',
    name: '0.96" I2C OLED Display',
    category: 'sensors',
    description: '128x64 pixel monochrome SSD1306 OLED screen with I2C interface.',
    symbolType: 'oled',
    width: 95,
    height: 85,
    defaultRefPrefix: 'DISP',
    defaultProperties: { text: 'VoltNex Labs\nReady.' },
    pins: [
      { id: 'gnd', name: 'GND', x: 20, y: 0, type: 'ground' },
      { id: 'vcc', name: 'VCC', x: 40, y: 0, type: 'power', description: '3.3V / 5V' },
      { id: 'scl', name: 'SCL', x: 60, y: 0, type: 'digital', description: 'I2C Clock' },
      { id: 'sda', name: 'SDA', x: 80, y: 0, type: 'digital', description: 'I2C Data' },
    ],
  },
  {
    id: 'lcd_16x2_i2c',
    name: '16x2 LCD (I2C Adapter)',
    category: 'sensors',
    description: '16 character by 2 line alphanumeric display with I2C PCF8574 module.',
    symbolType: 'lcd',
    width: 140,
    height: 80,
    defaultRefPrefix: 'DISP',
    defaultProperties: { line1: 'VoltNex Circuit', line2: 'Online...' },
    pins: [
      { id: 'gnd', name: 'GND', x: 25, y: 80, type: 'ground' },
      { id: 'vcc', name: 'VCC', x: 55, y: 80, type: 'power', description: '5V' },
      { id: 'sda', name: 'SDA', x: 85, y: 80, type: 'digital', description: 'I2C Data' },
      { id: 'scl', name: 'SCL', x: 115, y: 80, type: 'digital', description: 'I2C Clock' },
    ],
  },
  {
    id: 'gps_module',
    name: 'NEO-6M GPS Module',
    category: 'sensors',
    description: 'High-performance u-blox NEO-6M satellite positioning receiver module with integrated ceramic patch antenna and serial UART.',
    symbolType: 'gps',
    width: 90,
    height: 85,
    defaultRefPrefix: 'GPS',
    defaultProperties: { baudRate: 9600, satellites: 7, fixStatus: '3D Fix' },
    pins: [
      { id: 'vcc', name: 'VCC', x: 18, y: 85, type: 'power', description: '3.0V - 5.0V Power In', aliases: ['VCC', '3V3', '5V'], physicalNumber: 1 },
      { id: 'rx', name: 'RX', x: 38, y: 85, type: 'digital', description: 'UART Receive (TTL)', aliases: ['RXD'], physicalNumber: 2 },
      { id: 'tx', name: 'TX', x: 58, y: 85, type: 'digital', description: 'UART Transmit (TTL)', aliases: ['TXD'], physicalNumber: 3 },
      { id: 'gnd', name: 'GND', x: 78, y: 85, type: 'ground', description: 'Ground Return', aliases: ['GND'], physicalNumber: 4 },
    ],
  },
];

export function getComponentDefinition(typeId: string): CircuitComponentDefinition | undefined {
  return COMPONENT_DEFINITIONS.find((def) => def.id === typeId);
}

export function getCategoryComponents(category: ComponentCategory): CircuitComponentDefinition[] {
  return COMPONENT_DEFINITIONS.filter((def) => def.category === category);
}

export function searchComponents(query: string, category: string = 'all'): CircuitComponentDefinition[] {
  const cleanQ = query.trim().toLowerCase();
  return COMPONENT_DEFINITIONS.filter((def) => {
    const matchesCategory = category === 'all' || def.category === category;
    if (!matchesCategory) return false;
    if (!cleanQ) return true;

    if (def.name.toLowerCase().includes(cleanQ)) return true;
    if (def.category.toLowerCase().includes(cleanQ)) return true;
    if (def.description.toLowerCase().includes(cleanQ)) return true;
    if (def.defaultRefPrefix.toLowerCase().includes(cleanQ)) return true;

    const matchesPin = def.pins.some((pin) => {
      if (pin.name.toLowerCase().includes(cleanQ)) return true;
      if (pin.id.toLowerCase().includes(cleanQ)) return true;
      if (pin.gpio && pin.gpio.toString().toLowerCase().includes(cleanQ)) return true;
      if (pin.description && pin.description.toLowerCase().includes(cleanQ)) return true;
      if (pin.aliases && pin.aliases.some((a) => a.toLowerCase().includes(cleanQ))) return true;
      return false;
    });

    return matchesPin;
  });
}

