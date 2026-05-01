import React from 'react';
import { Mic } from 'lucide-react';

interface AriVoiceAssistantProps {
  lang: string;
}

export const AriVoiceAssistant: React.FC<AriVoiceAssistantProps> = ({ lang }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center min-h-60 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mic className="w-8 h-8 animate-pulse" />
          <h3 className="text-xl font-black">Listening...</h3>
        </div>
        <p className="text-sm text-white/80">
          {lang === 'es' ? 'Hablando...' : 'Speak now...'}
        </p>
      </div>
    </div>
  );
};

export default AriVoiceAssistant;
