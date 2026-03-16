import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type PredictionResult } from "@/lib/symptomEngine";
import SymptomChecker from "@/components/SymptomChecker";
import PredictionResults from "@/components/PredictionResults";
import ChatbotAssistant from "@/components/ChatbotAssistant";
import { Activity, ShieldCheck, Stethoscope, ArrowRight, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

type View = "home" | "symptoms" | "results";

const Index = () => {
  const { signOut } = useAuth();
  const [view, setView] = useState<View>("home");
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleResult = (r: PredictionResult) => {
    setResult(r);
    setView("results");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => setView("home")} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-health flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">HealthAI</span>
          </button>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <button onClick={() => setView("home")} className="hover:text-foreground transition-colors">Home</button>
            <button onClick={() => setView("symptoms")} className="hover:text-foreground transition-colors">Symptom Checker</button>
            <button onClick={signOut} className="hover:text-foreground transition-colors flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Hero */}
              <section className="text-center py-16 sm:py-24 space-y-6 max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  <Heart className="w-4 h-4" /> AI-Powered Health Analysis
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-6xl font-display font-bold leading-tight"
                >
                  AI Health{" "}
                  <span className="text-gradient-health">Symptom Checker</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground max-w-xl mx-auto"
                >
                  Get early disease predictions powered by AI. Enter your symptoms and receive instant health insights with recommended precautions.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    size="lg"
                    onClick={() => setView("symptoms")}
                    className="gradient-health text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Start Diagnosis <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </section>

              {/* Features */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pb-16">
                {[
                  { icon: Activity, title: "Symptom Analysis", desc: "AI-driven matching against a comprehensive disease database" },
                  { icon: ShieldCheck, title: "Precaution Guide", desc: "Personalized precautions and health recommendations" },
                  { icon: Stethoscope, title: "Smart Triage", desc: "Know when to seek home care, a doctor, or emergency help" },
                ].map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="glass-card rounded-2xl p-6 text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-health flex items-center justify-center mx-auto">
                      <f.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </motion.div>
                ))}
              </section>

              {/* Disclaimer */}
              <div className="text-center text-xs text-muted-foreground pb-8">
                ⚕️ This tool provides health guidance only and is <strong>not a replacement</strong> for professional medical advice.
              </div>
            </motion.div>
          )}

          {view === "symptoms" && (
            <motion.div key="symptoms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SymptomChecker onResult={handleResult} />
            </motion.div>
          )}

          {view === "results" && result && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PredictionResults result={result} onBack={() => setView("symptoms")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ChatbotAssistant />
    </div>
  );
};

export default Index;
