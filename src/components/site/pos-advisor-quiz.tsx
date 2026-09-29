"use client";

import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type QuizData = {
  business: string;
  tills: string;
  priority: string;
  recommendedCategory?: string;
  recommendedProduct?: string;
};

export function PosAdvisorQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizData>({
    business: "Retail Store",
    tills: "1–2 Counters",
    priority: "High Reliability & Speed",
  });
  const [completed, setCompleted] = useState(false);

  const handleComplete = (finalAnswers: QuizData) => {
    let recProduct = "POS-1000-HD Touch Terminal & PRP-300 Printer";
    let recCategory = "pos-terminals";

    if (finalAnswers.business === "Supermarket") {
      recProduct = "Omnidirectional Scanner + Cash Drawer Station";
      recCategory = "barcode-scanners";
    } else if (finalAnswers.business === "Restaurant / Cafe") {
      recProduct = "Fanless Touch POS & Kitchen Thermal Printer";
      recCategory = "pos-terminals";
    } else if (finalAnswers.priority === "Self-Service & Compact") {
      recProduct = "KS-215 Interactive Self-Service Kiosk";
      recCategory = "kiosks";
    }

    const payload: QuizData = {
      ...finalAnswers,
      recommendedProduct: recProduct,
      recommendedCategory: recCategory,
    };

    setAnswers(payload);
    setCompleted(true);

    try {
      localStorage.setItem("mifaretech-quiz-answers", JSON.stringify(payload));
    } catch {
      // Ignore localStorage failure in private modes
    }
  };

  const handleRetake = () => {
    setStep(0);
    setCompleted(false);
  };

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-xl">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="editorial-tag text-accent-700 dark:text-accent-400">
          Hardware Recommendation Quiz
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
          Find the right POS for your business
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          Answer 3 quick questions to identify the ideal setup for your counters.
        </p>
      </div>

      {!completed ? (
        <div className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-center">
                Step 1 of 3: What is your primary business type?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Retail Store", "Supermarket", "Restaurant / Cafe", "Pharmacy"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, business: opt }));
                      setStep(1);
                    }}
                    className={`p-4 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      answers.business === opt
                        ? "border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-center">
                Step 2 of 3: How many checkout counters or tills do you operate?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["1 Counter", "2–4 Counters", "5–10 Counters", "10+ Enterprise"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, tills: opt }));
                      setStep(2);
                    }}
                    className={`p-4 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      answers.tills === opt
                        ? "border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-center">
                Step 3 of 3: What is your biggest hardware priority?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["High Reliability & Speed", "Self-Service & Compact", "Budget Efficiency"].map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        handleComplete({ ...answers, priority: opt });
                      }}
                      className="p-4 rounded-2xl border border-border bg-background hover:border-brand-600 text-xs font-bold text-center transition-all cursor-pointer"
                    >
                      {opt}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-6 p-6 sm:p-8 rounded-2xl bg-secondary/40 border border-border">
          <div className="inline-flex size-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 items-center justify-center">
            <CheckCircle2 className="size-7" />
          </div>
          <div className="space-y-2">
            <span className="editorial-tag text-emerald-700 dark:text-emerald-400">
              Matched Configuration
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {answers.recommendedProduct}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Based on your business ({answers.business}), {answers.tills}, and focus on{" "}
              {answers.priority}, this configuration guarantees continuous checkout uptime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={`/contact?source=quiz&business=${encodeURIComponent(
                answers.business,
              )}&tills=${encodeURIComponent(answers.tills)}`}
              className="px-7 py-3.5 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
            >
              <span>Enquire with this Setup</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href={`/catalogue?category=${answers.recommendedCategory || "pos-terminals"}`}
              className="px-6 py-3 rounded-full border border-border bg-card hover:bg-muted text-foreground font-bold text-xs uppercase tracking-wider transition-all"
            >
              Browse Category
            </Link>

            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Retake quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
