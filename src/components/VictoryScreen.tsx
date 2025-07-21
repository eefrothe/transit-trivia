// src/components/VictoryScreen.tsx
import React, { useEffect, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";
import { ShareIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface VictoryScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
  playConfettiSound: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ score, total, onRestart, playConfettiSound }) => {
  const [showShareMsg, setShowShareMsg] = useState(false);

  useEffect(() => {
    import("canvas-confetti").then((module) => {
      const confetti = module.default;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      playConfettiSound();
    });
  }, []);

  const handleShare = async () => {
    const text = `I scored ${score} out of ${total} on Transit Trivia! 🚇💡 Try to beat me!`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Transit Trivia", text, url });
      } catch (e) {
        console.warn("Share failed:", e);
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShowShareMsg(true);
      setTimeout(() => setShowShareMsg(false), 3000);
    }
  };

  return (
    <div className="text-center py-20 animate-fade-in">
      <h2 className="text-3xl font-bold mb-4 text-emerald-400">🎉 Game Over!</h2>
      <p className="text-gray-300 text-lg mb-4">You scored:</p>
      <AnimatedCounter value={score} duration={1000} className="text-4xl font-bold text-white" />
      <p className="text-sm text-gray-400 mb-6">out of {total}</p>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleShare}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ShareIcon className="w-5 h-5" />
          Share
        </button>

        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Play Again
        </button>
      </div>

      {showShareMsg && <p className="text-sm text-green-400 mt-3">Link copied to clipboard ✅</p>}
    </div>
  );
};

export default VictoryScreen;
