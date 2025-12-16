import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface NewCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCardCreated: () => void;
}

export function NewCardDialog({ open, onOpenChange, onCardCreated }: NewCardDialogProps) {
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a card",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Generate audio from ElevenLabs
      const audioResponse = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": "ENTER_YOUR_KEY_HERE",
          },
          body: JSON.stringify({
            text: backText,
            model_id: "eleven_turbo_v2_5",
          }),
        }
      );

      if (!audioResponse.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await audioResponse.blob();

      // Step 2: Upload to Supabase Storage
      const filename = `${user.id}/${Date.now()}.mp3`;
      const { error: uploadError } = await supabase.storage
        .from("card-audio")
        .upload(filename, audioBlob, {
          contentType: "audio/mpeg",
        });

      if (uploadError) {
        throw new Error("Failed to upload audio");
      }

      // Step 3: Get public URL
      const { data: urlData } = supabase.storage
        .from("card-audio")
        .getPublicUrl(filename);

      const audioUrl = urlData.publicUrl;

      // Step 4: Insert card with audio URL
      const { error: insertError } = await supabase.from("cards").insert({
        front_text: frontText,
        back_text: backText,
        user_id: user.id,
        audio_url: audioUrl,
      });

      if (insertError) {
        throw new Error("Failed to create card");
      }

      toast({
        title: "Success",
        description: "Card created with audio!",
      });
      setFrontText("");
      setBackText("");
      onCardCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Card</DialogTitle>
          <DialogDescription>
            Add a new flashcard to your collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="front">Native Language (Front)</Label>
            <Input
              id="front"
              placeholder="Enter word or phrase..."
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="back">Target Language (Back)</Label>
            <Input
              id="back"
              placeholder="Enter translation..."
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
