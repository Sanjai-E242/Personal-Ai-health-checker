import { motion } from "framer-motion";
import { type PredictionResult } from "@/lib/symptomEngine";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Stethoscope, Siren, Heart, AlertTriangle, Activity } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  result: PredictionResult;
  onBack: () => void;
}

const sevColor = { Low: "text-health-success", Medium: "text-health-warning", High: "text-health-danger" };
const sevBg = { Low: "bg-health-success/10", Medium: "bg-health-warning/10", High: "bg-health-danger/10" };
const recIcon = { "Home care": ShieldCheck, "Doctor consultation": Stethoscope, "Emergency care": Siren };
const recColor = { "Home care": "text-health-success", "Doctor consultation": "text-health-warning", "Emergency care": "text-health-danger" };

const CHART_COLORS = [
  "hsl(199, 89%, 48%)", "hsl(168, 71%, 41%)", "hsl(262, 83%, 58%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"
];

export default function PredictionResults({ result, onBack }: Props) {
  const RecIcon = recIcon[result.recommendation];
  const chartData = result.allPredictions.map(p => ({ name: p.disease, probability: p.probability }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Symptoms
      </Button>

      {/* Emergency alert */}
      {result.severity === "High" && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-health-danger/10 border border-health-danger/30 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-6 h-6 text-health-danger flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-health-danger">High Severity Alert</p>
            <p className="text-sm text-foreground/80">Your symptoms may indicate a serious condition. Please seek medical attention promptly.</p>
          </div>
        </motion.div>
      )}

      {/* Main result card */}
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Predicted Condition</p>
            <h2 className="text-3xl font-display font-bold text-gradient-health">{result.disease}</h2>
            <p className="text-muted-foreground mt-1 text-sm max-w-md">{result.description}</p>
          </div>
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" className="stroke-muted" />
                <circle
                  cx="50" cy="50" r="42" strokeWidth="8" fill="none"
                  className="stroke-primary"
                  strokeLinecap="round"
                  strokeDasharray={`${result.probability * 2.64} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-foreground">{result.probability}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Probability</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${sevBg[result.severity]} ${sevColor[result.severity]}`}>
            <Activity className="w-4 h-4" /> Severity: {result.severity}
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 ${recColor[result.recommendation]}`}>
            <RecIcon className="w-4 h-4" /> {result.recommendation}
          </div>
        </div>
      </div>

      {/* Chart + Precautions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Disease Probability
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} className="text-xs" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="probability" radius={[0, 6, 6, 0]} barSize={20}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-health-danger" /> Recommended Precautions
          </h3>
          <ul className="space-y-3">
            {result.precautions.map((p, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full gradient-health flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                </div>
                <span className="text-sm text-foreground/90">{p}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Health tips */}
      <div className="glass-card rounded-2xl p-6 space-y-3">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-health-teal" /> Health Awareness Tips
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground/80">
          {[
            "Maintain a balanced diet rich in vitamins and minerals",
            "Exercise regularly — at least 30 minutes daily",
            "Get 7-8 hours of quality sleep each night",
            "Stay hydrated — drink 8 glasses of water daily",
            "Wash hands frequently to prevent infections",
            "Schedule regular health check-ups",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-health-teal mt-1.5 flex-shrink-0" />
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground px-4">
        ⚕️ <strong>Disclaimer:</strong> This tool provides early health guidance only and is <strong>not a replacement</strong> for professional medical diagnosis. Always consult a qualified healthcare provider.
      </div>
    </motion.div>
  );
}
