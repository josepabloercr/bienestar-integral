import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getMotivationalQuote() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Genera una frase motivacional corta y poderosa en español para alguien que está trabajando en su bienestar físico y salud. Máximo 15 palabras.",
    });
    return response.text || "La base de toda la felicidad es la salud.";
  } catch (error) {
    console.error("Error fetching quote:", error);
    return "La base de toda la felicidad es la salud.";
  }
}

export async function analyzeFoodImage(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: "Analiza esta comida. Indica qué es, estima las calorías y macros (proteína, carbohidratos, grasas) y da un consejo breve para mejorarla nutricionalmente. Responde en formato JSON.",
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            advice: { type: Type.STRING },
          },
          required: ["name", "calories", "protein", "carbs", "fat", "advice"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing food:", error);
    throw error;
  }
}

export async function getHealthRecommendations(userData: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Basado en estos datos: ${JSON.stringify(userData)}, da 3 recomendaciones personalizadas para mejorar la salud y alcanzar los objetivos. Responde en español.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return "Sigue adelante con tu plan de entrenamiento y nutrición balanceada.";
  }
}
