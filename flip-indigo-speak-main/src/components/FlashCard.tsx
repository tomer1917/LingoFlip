import { useState, useRef } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type Card = Tables<"cards">;

interface FlashCardProps {
  card: Card;
}

export function FlashCard({ card }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      const response = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": "ENTER_YOUR_KEY_HERE",
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_turbo_v2_5",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsPlaying(false);
    }
  };

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    
    // Speak the back text when flipping to back
    if (newFlipped && card.back_text) {
      speakText(card.back_text);
    }
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(card.back_text);
  };

  return (
    <div
      className="perspective-1000 h-48 cursor-pointer"
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 flex items-center justify-center shadow-lg">
          <p className="text-primary-foreground text-lg font-medium text-center">
            {card.front_text}
          </p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-card border border-border p-6 flex flex-col items-center justify-center shadow-lg">
          <p className="text-card-foreground text-lg font-medium text-center flex-1 flex items-center">
            {card.back_text}
          </p>
          
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={handlePlayAudio}
            disabled={isPlaying}
          >
            {isPlaying ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4 mr-1" />
            )}
            {isPlaying ? "Playing..." : "Play"}
          </Button>
        </div>
      </div>
    </div>
  );
}
