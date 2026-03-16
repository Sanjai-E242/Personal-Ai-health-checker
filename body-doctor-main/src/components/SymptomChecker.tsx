import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_SYMPTOMS, predictDisease, type PredictionResult } from "@/lib/symptomEngine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Check, X, AlertTriangle, ArrowRight, Search } from "lucide-react";

interface Props {
  onResult: (result: PredictionResult) => void;
}

export default function SymptomChecker({ onResult }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [duration, setDuration] = useState("");
  const [severityLevel, setSeverityLevel] = useState([5]);

  const filtered = ALL_SYMPTOMS.filter(
    s => s.toLowerCase().includes(search.toLowerCase()) && !selected.includes(s)
  );

  const toggle = (sym: string) => {
    setSelected(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    const result = predictDisease(selected);
    onResult(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold text-foreground">Enter Your Symptoms</h2>
        <p className="text-muted-foreground">Select all symptoms you're currently experiencing</p>
      </div>

      {/* Selected symptoms */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selected.map(s => (
              <Badge
                key={s}
                className="gradient-health text-primary-foreground px-3 py-1.5 text-sm cursor-pointer gap-1.5"
                onClick={() => toggle(s)}
              >
                {s} <X className="w-3.5 h-3.5" />
              </Badge>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & dropdown */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search symptoms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {filtered.map(sym => (
            <button
              key={sym}
              onClick={() => toggle(sym)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-secondary-foreground bg-secondary hover:bg-primary/10 transition-colors text-left"
            >
              <div className="w-4 h-4 rounded border border-border flex items-center justify-center">
                {selected.includes(sym) && <Check className="w-3 h-3 text-primary" />}
              </div>
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Patient info */}
      <div className="glass-card rounded-xl p-6 space-y-5">
        <h3 className="font-display font-semibold text-foreground">Patient Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Age Group</label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["0-12", "13-17", "18-35", "36-55", "56+"].map(a => (
                  <SelectItem key={a} value={a}>{a} years</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Gender</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["Male", "Female", "Other"].map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Duration</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["Less than 1 day", "1-3 days", "3-7 days", "1-2 weeks", "More than 2 weeks"].map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Symptom Severity: <span className="text-primary font-semibold">{severityLevel[0]}/10</span>
          </label>
          <Slider
            value={severityLevel}
            onValueChange={setSeverityLevel}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mild</span><span>Moderate</span><span>Severe</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col items-center gap-3">
        {selected.length === 0 && (
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-health-warning" /> Please select at least one symptom
          </p>
        )}
        <Button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          size="lg"
          className="gradient-health text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
        >
          Analyze Symptoms <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
