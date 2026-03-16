export const ALL_SYMPTOMS = [
  "Fever", "Headache", "Cough", "Fatigue", "Nausea",
  "Chest pain", "Sore throat", "Body pain", "Vomiting", "Diarrhea",
  "Runny nose", "Sneezing", "Chills", "Loss of appetite", "Dizziness",
  "Shortness of breath", "Joint pain", "Muscle pain", "Rash", "Sweating",
  "Abdominal pain", "Dehydration", "Loss of taste", "Loss of smell", "Dry cough",
] as const;

export type Symptom = typeof ALL_SYMPTOMS[number];

interface DiseaseProfile {
  name: string;
  symptoms: Symptom[];
  weights: number[];
  severity: "Low" | "Medium" | "High";
  precautions: string[];
  recommendation: "Home care" | "Doctor consultation" | "Emergency care";
  description: string;
}

const DISEASE_DB: DiseaseProfile[] = [
  {
    name: "Common Cold",
    symptoms: ["Runny nose", "Sneezing", "Sore throat", "Cough", "Fatigue", "Headache"],
    weights: [0.9, 0.85, 0.8, 0.6, 0.5, 0.4],
    severity: "Low",
    precautions: ["Rest and stay hydrated", "Use over-the-counter cold medications", "Gargle with warm salt water", "Use a humidifier"],
    recommendation: "Home care",
    description: "A viral infection of the upper respiratory tract.",
  },
  {
    name: "Influenza (Flu)",
    symptoms: ["Fever", "Body pain", "Headache", "Fatigue", "Cough", "Chills", "Muscle pain"],
    weights: [0.95, 0.9, 0.85, 0.85, 0.7, 0.8, 0.8],
    severity: "Medium",
    precautions: ["Drink plenty of fluids", "Take adequate rest", "Use fever medication (acetaminophen/ibuprofen)", "Avoid contact with others"],
    recommendation: "Doctor consultation",
    description: "A contagious respiratory illness caused by influenza viruses.",
  },
  {
    name: "Migraine",
    symptoms: ["Headache", "Nausea", "Dizziness", "Fatigue", "Loss of appetite"],
    weights: [0.95, 0.7, 0.65, 0.5, 0.4],
    severity: "Medium",
    precautions: ["Rest in a dark, quiet room", "Apply cold compress to forehead", "Stay hydrated", "Avoid bright lights and loud sounds"],
    recommendation: "Doctor consultation",
    description: "A neurological condition causing intense, recurring headaches.",
  },
  {
    name: "Food Poisoning",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "Fever", "Dehydration"],
    weights: [0.9, 0.85, 0.85, 0.8, 0.5, 0.7],
    severity: "Medium",
    precautions: ["Stay hydrated with ORS or clear fluids", "Avoid solid food initially", "Eat bland foods when recovering", "Seek medical help if symptoms persist over 48 hours"],
    recommendation: "Doctor consultation",
    description: "Illness caused by consuming contaminated food or beverages.",
  },
  {
    name: "Dengue Fever",
    symptoms: ["Fever", "Headache", "Body pain", "Joint pain", "Rash", "Fatigue", "Nausea"],
    weights: [0.95, 0.85, 0.9, 0.85, 0.6, 0.7, 0.5],
    severity: "High",
    precautions: ["Seek immediate medical attention", "Stay hydrated", "Avoid aspirin and NSAIDs", "Monitor platelet count", "Use mosquito nets"],
    recommendation: "Emergency care",
    description: "A mosquito-borne viral infection common in tropical regions.",
  },
  {
    name: "Malaria",
    symptoms: ["Fever", "Chills", "Sweating", "Headache", "Nausea", "Fatigue", "Body pain"],
    weights: [0.95, 0.9, 0.85, 0.7, 0.6, 0.7, 0.6],
    severity: "High",
    precautions: ["Seek immediate medical treatment", "Complete the full course of antimalarial medication", "Use mosquito repellent and nets", "Stay hydrated"],
    recommendation: "Emergency care",
    description: "A life-threatening disease caused by parasites transmitted through mosquito bites.",
  },
  {
    name: "COVID-like Symptoms",
    symptoms: ["Fever", "Dry cough", "Fatigue", "Loss of taste", "Loss of smell", "Shortness of breath", "Body pain", "Sore throat"],
    weights: [0.85, 0.9, 0.8, 0.9, 0.9, 0.75, 0.6, 0.5],
    severity: "High",
    precautions: ["Self-isolate immediately", "Get tested for COVID-19", "Monitor oxygen levels", "Seek emergency care if breathing difficulty worsens", "Wear a mask around others"],
    recommendation: "Doctor consultation",
    description: "Symptoms resembling COVID-19, a respiratory illness caused by SARS-CoV-2.",
  },
];

export interface PredictionResult {
  disease: string;
  probability: number;
  severity: "Low" | "Medium" | "High";
  precautions: string[];
  recommendation: "Home care" | "Doctor consultation" | "Emergency care";
  description: string;
  allPredictions: { disease: string; probability: number; severity: "Low" | "Medium" | "High" }[];
}

export function predictDisease(selectedSymptoms: string[]): PredictionResult {
  const normalised = selectedSymptoms.map(s => s.trim());

  const scores = DISEASE_DB.map(disease => {
    let score = 0;
    let maxPossible = 0;
    disease.symptoms.forEach((sym, i) => {
      maxPossible += disease.weights[i];
      if (normalised.includes(sym)) {
        score += disease.weights[i];
      }
    });
    const probability = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
    // Boost if user has many matching symptoms
    const matchRatio = normalised.filter(s => disease.symptoms.includes(s as Symptom)).length / disease.symptoms.length;
    const boosted = probability * (0.6 + 0.4 * matchRatio);
    return { disease, probability: Math.min(Math.round(boosted * 10) / 10, 99) };
  });

  scores.sort((a, b) => b.probability - a.probability);

  const top = scores[0];
  return {
    disease: top.disease.name,
    probability: Math.max(top.probability, 15),
    severity: top.disease.severity,
    precautions: top.disease.precautions,
    recommendation: top.disease.recommendation,
    description: top.disease.description,
    allPredictions: scores
      .filter(s => s.probability > 5)
      .slice(0, 5)
      .map(s => ({ disease: s.disease.name, probability: Math.max(s.probability, 5), severity: s.disease.severity })),
  };
}

// Simple chatbot responses
const CHAT_RESPONSES: Record<string, string> = {
  "headache with fever": "Headache combined with fever can indicate **Influenza (Flu)**, **Dengue**, or **Malaria**. If symptoms persist for more than 2 days or are severe, please consult a doctor immediately. Stay hydrated and rest.",
  "treat cold": "For a common cold:\n- **Rest** and get plenty of sleep\n- **Stay hydrated** – drink water, broth, or warm lemon water\n- **Gargle** with warm salt water for sore throat\n- **Over-the-counter** decongestants and pain relievers can help\n- Most colds resolve within 7-10 days",
  "chest pain": "⚠️ **Chest pain can be a medical emergency.** If you experience sudden, severe chest pain, especially with shortness of breath, sweating, or pain radiating to the arm/jaw, **call emergency services immediately**. It could indicate a heart condition.",
  "fever": "Fever is the body's natural response to infection. **Home remedies**: Rest, drink fluids, use a cool compress. **Seek medical help** if fever exceeds 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe symptoms.",
  "cough": "For a persistent cough:\n- Stay hydrated\n- Use honey and warm water\n- Try a humidifier\n- Avoid irritants like smoke\n- **See a doctor** if the cough lasts more than 3 weeks, produces blood, or comes with shortness of breath.",
};

export function getChatResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(CHAT_RESPONSES)) {
    if (lower.includes(key)) return response;
  }

  if (lower.includes("symptom") || lower.includes("feel")) {
    return "I'd recommend using our **Symptom Checker** tool for a more accurate analysis. You can select your symptoms and get a detailed prediction. Remember, this tool provides guidance only and is not a replacement for professional medical diagnosis.";
  }

  return "I'm your AI Health Assistant. I can help with basic health questions like:\n- \"What does headache with fever mean?\"\n- \"How to treat cold?\"\n- \"What should I do about chest pain?\"\n\nFor a comprehensive analysis, try our **Symptom Checker** tool. ⚕️\n\n*Note: This is not a substitute for professional medical advice.*";
}
