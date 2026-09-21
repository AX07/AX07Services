import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: "FlyFoil Formosa",
    type: "eFoil Rental & Booking Engine",
    location: "Cabanas de Tavira",
    color: "from-blue-900/20 to-cyan-900/5"
  },
  {
    title: "CryptoAX07",
    type: "In-House Venture & Algorithmic Case Study",
    location: "AX07 Labs / Global Edge",
    color: "from-violet-900/20 to-teal-900/5"
  },
  {
    title: "FinTrack AI",
    type: "Automated Asset Management",
    location: "EU Market",
    color: "from-zinc-800/40 to-zinc-900/10"
  },
  {
    title: "Altura Kites",
    type: "Kitesurf School & Booking Engine",
    location: "Altura, Algarve",
    color: "from-orange-900/20 to-red-900/5"
  },
  {
    title: "Albania Fácil",
    type: "Travel Discovery App",
    location: "Tirana / Digital",
    color: "from-purple-900/20 to-pink-900/5"
  }
];

export function Showcase() {
  return (
    <section className="py-32 px-6 border-t border-white/5 relative z-20 bg-[#070708]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <span className="text-micro mb-4 block">Selected Works</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Engineered for conversion.
            </h2>
          </div>
          <p className="text-zinc-500 max-w-sm">
            We abandon standard grids for immersive, full-width canvases that let the product breathe.
          </p>
        </div>

        <div className="flex flex-col gap-12 md:gap-24">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="group relative w-full aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden glass-panel flex flex-col justify-between p-8 md:p-12 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-50 group-hover:opacity-100 transition-opacity duration-700`} />
              
              {/* Overlay Grain/Texture */}
              <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />

              <div className="relative z-10 flex justify-between items-start">
                <div className="text-micro px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                  {project.location}
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 group-hover:translate-x-4 transition-transform duration-500 ease-out">
                  {project.title}
                </h3>
                <p className="text-lg md:text-xl text-zinc-400 font-sans group-hover:translate-x-4 transition-transform duration-500 delay-75 ease-out">
                  {project.type}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
