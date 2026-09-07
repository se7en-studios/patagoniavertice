"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}

/**
 * Player de video vertical 9:16 (formato story) en card con borde oro
 * y sombra. El video recién se monta al hacer click - no descarga antes.
 */
export function VideoPlayer({
  src,
  poster,
  title = "Servicios Altum Inmobiliaria",
  className = "",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{ maxWidth: "400px" }}
    >
      {/* Card 9:16 vertical con borde oro + sombra */}
      <div
        className="relative bg-black rounded-lg overflow-hidden group border-2 border-gold-500/30 shadow-2xl shadow-gold-500/20"
        style={{ aspectRatio: "9 / 16", contain: "layout style paint" }}
      >
        <AnimatePresence>
          {isPlaying ? (
            <motion.video
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={src}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover"
              onLoadedData={() => setIsLoading(false)}
            />
          ) : (
            <motion.div
              key="thumbnail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center cursor-pointer"
              onClick={handlePlay}
              role="button"
              aria-label={`Reproducir video: ${title}`}
            >
              {/* Poster opcional */}
              {poster && (
                <img
                  src={poster}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-navy-900/70" />

              {/* Play button con glow pulsante */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 flex items-center justify-center"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(201, 168, 76, 0.3)",
                      "0 0 40px rgba(201, 168, 76, 0.5)",
                      "0 0 20px rgba(201, 168, 76, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center"
                >
                  <Play className="w-6 h-6 text-navy-900 fill-current ml-1" />
                </motion.div>
              </motion.div>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-900 to-transparent p-4">
                <p className="text-white font-cormorant text-base text-center">
                  {title}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading bars mientras buffea */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-navy-900/50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex gap-1">
              {[0, 0.1, 0.2].map((delay) => (
                <motion.div
                  key={delay}
                  animate={{ scaleY: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay }}
                  className="w-1 h-4 bg-gold-500 rounded"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
