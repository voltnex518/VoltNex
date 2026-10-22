import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ArrowRight,
  Search,
  Cpu,
  Wifi,
  Radio,
  Bot,
  Gauge,
  CircuitBoard,
  BookOpen,
  FolderDown,
  Sparkles,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { InstagramIcon } from '../../components/common/Icons';
import { useData } from '../../context/DataContext';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { CodeBlock } from '../../components/common/CodeBlock';
import { Button } from '../../components/common/Button';

export const HomePage: React.FC = () => {
  const { projects, categories, tutorials, resources, settings } = useData();
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  // Published & featured projects
  const publishedProjects = projects.filter((p) => p.status === 'published');
  const featuredProjects = publishedProjects.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : publishedProjects.slice(0, 3);

  const publishedTutorials = tutorials.filter((t) => t.status === 'published').slice(0, 2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/projects?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    arduino: <Cpu className="w-5 h-5" />,
    'esp32-esp8266': <Wifi className="w-5 h-5" />,
    iot: <Radio className="w-5 h-5" />,
    robotics: <Bot className="w-5 h-5" />,
    sensors: <Gauge className="w-5 h-5" />,
    'embedded-systems': <CircuitBoard className="w-5 h-5" />,
  };

  const learningRoadmap = [
    {
      level: 'Stage 01',
      title: 'Circuit Physics & Prototyping',
      description: 'Ohm’s Law, pull-up/pull-down networks, transistor switches, and clean breadboard layout.',
      tags: ['Arduino', 'Analog Sensors', 'Breadboarding'],
      difficulty: 'Beginner',
    },
    {
      level: 'Stage 02',
      title: 'Microcontroller Architecture',
      description: 'Bare-metal registers, timer interrupts, ADC conversions, and PWM motor controllers.',
      tags: ['ATmega328P', 'Interrupts', 'Motor Drivers'],
      difficulty: 'Beginner',
    },
    {
      level: 'Stage 03',
      title: 'Connected IoT Systems',
      description: 'Dual-core ESP32, FreeRTOS task pinning, MQTT broker telemetry, and deep-sleep optimization.',
      tags: ['ESP32', 'FreeRTOS', 'MQTT', 'Low Power'],
      difficulty: 'Intermediate',
    },
    {
      level: 'Stage 04',
      title: 'Autonomous Robotics & Custom PCBs',
      description: 'Sonar radar scanning, RF telemetry, sub-GHz LoRa, and KiCad PCB fabrication geometry.',
      tags: ['Robotics', 'LoRa', 'KiCad', 'Custom Hardware'],
      difficulty: 'Advanced',
    },
  ];

  const showcaseSnippet = `// VoltNex ESP32 Ultra-Low Power Sensor Loop
#include <WiFi.h>
#include <esp_sleep.h>

#define SENSOR_POWER_PIN 23
#define TIME_TO_SLEEP_SEC 900 // 15 Minutes

void setup() {
  pinMode(SENSOR_POWER_PIN, OUTPUT);
  digitalWrite(SENSOR_POWER_PIN, HIGH); // Gate sensor VCC on
  delay(10);
  
  float telemetryValue = analogRead(34) * (3.3 / 4095.0);
  digitalWrite(SENSOR_POWER_PIN, LOW);  // Turn off sensor to conserve mAh
  
  // Enter deep sleep preserving battery life for months
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP_SEC * 1000000ULL);
  esp_deep_sleep_start();
}`;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 border-b border-slate-200/60 engineering-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Brand Logo Emblem */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white p-1 shadow-2xl shadow-blue-500/25 ring-4 ring-blue-500/15 hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.png"
                  alt="VoltNex Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span>Open-Source Hardware & Embedded Engineering</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 tracking-tight leading-[1.1]">
              Build Something <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                Extraordinary.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
              VoltNex Labs is an open engineering archive. Discover production-tested Arduino & ESP32 blueprints, autonomous robotics, wiring schematics, and clean firmware.
            </p>

            {/* Search Bar in Hero */}
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl shadow-elevated border border-slate-200/80 p-2 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search ESP32, Arduino, LoRa, robotics, sensors..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full bg-transparent border-0 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <Button type="submit" size="sm">
                  Search
                </Button>
              </div>
            </form>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/projects')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Blueprints
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/tutorials')}
                leftIcon={<BookOpen className="w-4 h-4" />}
              >
                Browse Tutorials
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div>
                <div className="text-2xl font-bold font-display text-slate-900">
                  {publishedProjects.length}+
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">Verified Blueprints</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-blue-600">
                  {categories.length}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">Hardware Domains</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-cyan-600">
                  {resources.length}+
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">Schematics & CAD</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-indigo-600">100%</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">Free & Open Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Builds</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
              Featured Electronics Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View All Blueprints ({publishedProjects.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Category Explorer Section */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600">
              Hardware Taxonomy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
              Explore by Architecture & Domain
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Browse tailored hardware guides, circuit diagrams, and pinout references.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const count = publishedProjects.filter((p) =>
                p.categories?.some((c) => c.slug === cat.slug)
              ).length;
              const Icon = categoryIcons[cat.slug] || <Cpu className="w-5 h-5" />;

              return (
                <Link
                  key={cat.id}
                  to={`/projects?category=${cat.slug}`}
                  className="group p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-elevated transition-all duration-200 flex flex-col justify-between bg-slate-50/50 hover:bg-white"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                      {Icon}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-blue-600 font-mono font-medium">
                    <span>{count} Blueprints</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Paths Roadmap */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
            Curriculum
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
            Beginner-to-Advanced Maker Roadmap
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Structured stages designed to guide builders from basic breadboard circuits to complex IoT telemetry networks and robotics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningRoadmap.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle hover:shadow-elevated transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-mono font-bold text-blue-600 uppercase mb-2">
                  {item.level}
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code & Circuit Showcase Preview Section */}
      <section className="py-16 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-semibold mb-4">
                <Terminal className="w-3.5 h-3.5" />
                <span>Production Firmware Archive</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Inspect Real Code. Follow Proven Wiring.
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                VoltNex does not provide vague pseudocode or theoretical diagrams. Every project includes verified C/C++ or Python source code, complete with pin definitions, FreeRTOS queues, interrupt handlers, and error recovery.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Safety Tested</h4>
                    <p className="text-xs text-slate-400">
                      Voltage dividers, burden resistors, and decoupling caps documented on every diagram.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-400 mt-0.5">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">One-Click Copy & Download</h4>
                    <p className="text-xs text-slate-400">
                      Copy snippets with line formatting, or download ready-to-flash .ino, .cpp, and .zip bundles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                >
                  <FolderDown className="w-4 h-4" />
                  <span>Browse Source Files</span>
                </Link>
              </div>
            </div>

            <div>
              <CodeBlock
                code={showcaseSnippet}
                language="cpp"
                filename="volt_deep_sleep_node.ino"
                title="C++ ESP32 Telemetry Loop"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Tutorials Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600">
              Deep Dives
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
              Latest Engineering Tutorials
            </h2>
          </div>
          <Link
            to="/tutorials"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedTutorials.map((tut) => (
            <article
              key={tut.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-3">
                  <span className="text-blue-600 font-semibold">{tut.difficulty}</span>
                  <span>•</span>
                  <span>{tut.read_time}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                  <Link to={`/tutorials/${tut.slug}`}>{tut.title}</Link>
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {tut.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-5">
                  {tut.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-semibold text-blue-600">
                <Link
                  to={`/tutorials/${tut.slug}`}
                  className="inline-flex items-center gap-1 hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Full Tutorial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Creator Introduction Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Meet the Creator
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-2">
                Empowering the Next Generation of Hardware Engineers
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                Hi, I'm <strong className="text-white">Pradeep</strong>, creator of VoltNex Labs. My mission is to demystify embedded electronics, microcontroller firmware, and robotics by providing clean, reproducible, and verifiable blueprints with zero paywalls.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href={`https://instagram.com/${(settings?.creator_instagram || '@voltn.ex').replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600/80 hover:bg-pink-600 text-white text-xs font-semibold shadow-sm transition"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Follow {settings?.creator_instagram || '@voltn.ex'}</span>
                </a>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  <span>About VoltNex Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="w-full md:w-auto flex justify-center">
              <div className="p-4 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-md max-w-sm text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg">
                  P
                </div>
                <h4 className="text-base font-bold text-white">Pradeep</h4>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">
                  {settings?.creator_instagram || '@voltn.ex'}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Embedded Systems • IoT • Robotics Builder • Educator
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
