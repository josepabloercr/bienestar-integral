import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente de Bienestar Integral. ¿En qué puedo ayudarte hoy con tu salud, nutrición o entrenamiento?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: "Eres un asistente experto en salud, fitness y nutrición para la aplicación 'Bienestar Integral'. Tu tono es motivador, profesional y empático. Ayudas al usuario con dudas sobre sus comidas, ejercicios y progreso general. Mantén las respuestas concisas y útiles.",
        },
      });

      // We send the full history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model,
        contents: [
            ...history,
            { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
            systemInstruction: "Eres un asistente experto en salud, fitness y nutrición para la aplicación 'Bienestar Integral'. Tu tono es motivador, profesional y empático. Ayudas al usuario con dudas sobre sus comidas, ejercicios y progreso general. Mantén las respuestas concisas y útiles.",
        }
      });

      const aiText = response.text || "Lo siento, no pude procesar tu solicitud.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Hubo un error al conectar con la inteligencia artificial. Por favor, intenta de nuevo más tarde." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-surface-container-low rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
      <div className="p-6 bg-surface-container-high border-b border-white/5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-3xl">smart_toy</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">Asistente IA</h2>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Consulta tu Bienestar</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg",
              msg.role === 'user' 
                ? "bg-primary text-on-primary rounded-tr-none" 
                : "bg-surface-container-highest text-on-surface rounded-tl-none"
            )}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-surface-container-highest text-on-surface p-4 rounded-2xl rounded-tl-none flex gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-surface-container-low border-t border-white/5">
        <div className="relative flex items-center gap-4">
          <input
            type="text"
            className="flex-1 bg-surface-container-lowest border-none rounded-full py-4 px-6 text-sm focus:ring-2 focus:ring-secondary text-on-surface transition-all shadow-inner"
            placeholder="Escribe tu consulta aquí..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
