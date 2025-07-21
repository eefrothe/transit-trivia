import React from "react";

interface ShareButtonsProps {
  score: number;
  maxQuestions: number;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ score, maxQuestions }) => {
  const message = `🏆 I scored ${score}/${maxQuestions} in Transit Trivia! Think you can beat me?`;
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(message);

  const shareTwitter = () =>
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");

  const shareFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");

  const shareWhatsApp = () =>
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${message} ${window.location.href}`);
      alert("✅ Link copied to clipboard!");
    } catch {
      alert("⚠️ Failed to copy the link.");
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6">
      <button
        onClick={shareTwitter}
        className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Share on Twitter
      </button>

      <button
        onClick={shareFacebook}
        className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Share on Facebook
      </button>

      <button
        onClick={shareWhatsApp}
        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Share on WhatsApp
      </button>

      <button
        onClick={copyToClipboard}
        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Copy Link
      </button>
    </div>
  );
};

export default ShareButtons;
