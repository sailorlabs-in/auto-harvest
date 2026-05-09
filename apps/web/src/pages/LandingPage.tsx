// ============================================================
// AutoHarvest — Landing Page
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import {
  Sprout,
  Code2,
  Zap,
  Boxes,
  ArrowRight,
  Bot,
  Cpu,
  Wheat,
  TreePine,
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'Programmable Robot',
    description: 'Write code to control your farming robot. Move, plant, harvest — all through scripting.',
    color: 'text-olive-400',
    bgColor: 'bg-olive-900/20',
  },
  {
    icon: Code2,
    title: 'Monaco Code Editor',
    description: 'Full-featured code editor with syntax highlighting, autocomplete, and real-time execution.',
    color: 'text-harvest-400',
    bgColor: 'bg-harvest-900/20',
  },
  {
    icon: Zap,
    title: 'Automation Engine',
    description: 'Automate every farming task. Write scripts that run while you optimize and expand.',
    color: 'text-energy',
    bgColor: 'bg-yellow-900/20',
  },
  {
    icon: Boxes,
    title: 'Expandable World',
    description: 'Start small, grow big. Unlock new crops, expand your farm, and scale your automation.',
    color: 'text-growth',
    bgColor: 'bg-green-900/20',
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-farm-975 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 bg-glow-olive opacity-40" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-olive-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-harvest-500/5 rounded-full blur-3xl" />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-olive-400/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-olive-950/50 border border-olive-800/30 text-olive-300 text-sm mb-8"
          >
            <div className="glow-dot" />
            Now in early development
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6"
          >
            Program Your Farm.{' '}
            <span className="text-gradient-hero">
              Automate the Harvest.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-farm-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-balance leading-relaxed"
          >
            Write code, control a robot, grow crops, and build the most efficient
            automated farm. A cozy programming game for aspiring automation engineers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/game" className="btn-primary text-base flex items-center gap-2 !px-8 !py-4">
              <Sprout className="w-5 h-5" />
              Play Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="btn-secondary text-base flex items-center gap-2 !px-8 !py-4">
              Create Account
            </Link>
          </motion.div>

          {/* Floating game preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="glass-panel p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="bg-farm-975 rounded-xl p-4 flex gap-4 min-h-[300px]">
                {/* Mini grid preview */}
                <div className="flex-1 grid grid-cols-6 grid-rows-6 gap-1">
                  {[...Array(36)].map((_, i) => {
                    const x = i % 6;
                    const y = Math.floor(i / 6);
                    const isBorder = x === 0 || y === 0 || x === 5 || y === 5;
                    const isRobot = x === 2 && y === 2;
                    const hasCrop = !isBorder && Math.random() > 0.5;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.02 }}
                        className={`rounded-md aspect-square flex items-center justify-center text-xs ${
                          isRobot
                            ? 'bg-farm-800 border-2 border-olive-500/50 shadow-lg shadow-olive-900/30'
                            : isBorder
                              ? 'bg-farm-800/60'
                              : 'bg-farm-900/80'
                        }`}
                      >
                        {isRobot ? (
                          <Bot className="w-4 h-4 text-olive-400" />
                        ) : hasCrop && !isBorder ? (
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                          >
                            {['🌾', '🥕', '🌽'][Math.floor(Math.random() * 3)]}
                          </motion.span>
                        ) : null}
                      </motion.div>
                    );
                  })}
                </div>
                {/* Mini code preview */}
                <div className="hidden sm:block w-48 bg-farm-950 rounded-lg p-3 font-mono text-xs text-farm-400 leading-relaxed">
                  <div className="text-farm-600 mb-1">// automation.js</div>
                  <div>
                    <span className="text-harvest-400">while</span>(
                    <span className="text-olive-400">true</span>){'{'}
                  </div>
                  <div className="pl-3 text-olive-300">moveRight();</div>
                  <div className="pl-3 text-olive-300">
                    plant(<span className="text-growth">"wheat"</span>);
                  </div>
                  <div className="pl-3 text-olive-300">harvest();</div>
                  <div>{'}'}</div>
                </div>
              </div>
            </div>

            {/* Glow under the card */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-olive-500/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              custom={0}
              className="font-display font-bold text-3xl sm:text-4xl text-farm-100 mb-4"
            >
              Everything you need to{' '}
              <span className="text-gradient">automate your farm</span>
            </motion.h2>
            <motion.p
              variants={fadeIn}
              custom={1}
              className="text-farm-400 text-lg max-w-xl mx-auto"
            >
              A full programming environment built for farming automation.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                variants={fadeIn}
                className="glass-panel p-6 hover:border-olive-700/40 transition-all duration-500 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-display font-semibold text-xl text-farm-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-farm-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn} custom={0} className="flex justify-center gap-4 mb-8">
              <Wheat className="w-8 h-8 text-harvest-400 animate-float" />
              <Cpu className="w-8 h-8 text-olive-400 animate-float" style={{ animationDelay: '1s' }} />
              <TreePine className="w-8 h-8 text-growth animate-float" style={{ animationDelay: '2s' }} />
            </motion.div>

            <motion.h2
              variants={fadeIn}
              custom={1}
              className="font-display font-bold text-3xl sm:text-4xl text-farm-100 mb-4"
            >
              Ready to start farming?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              custom={2}
              className="text-farm-400 text-lg mb-8"
            >
              Jump in and start coding your first automation script.
            </motion.p>
            <motion.div variants={fadeIn} custom={3}>
              <Link to="/game" className="btn-primary text-lg !px-10 !py-4 inline-flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                Start Playing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-farm-800/40 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-olive-500" />
            <span className="text-farm-500 text-sm">AutoHarvest © 2026</span>
          </div>
          <p className="text-farm-600 text-xs">
            A cozy farming automation programming game.
          </p>
        </div>
      </footer>
    </div>
  );
}
