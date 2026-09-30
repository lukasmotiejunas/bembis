"use client";
import { useState } from "react";
import { VisualizationResult, QuoteFormData } from "@/lib/types";
import { X, CheckCircle, Sparkles, Calendar, Phone, Mail, MapPin, User } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: VisualizationResult;
}

export default function QuoteModal({ isOpen, onClose, result }: Props) {
  const [form, setForm] = useState<QuoteFormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    installationDate: "",
    notes: "",
    originalImage: result.originalImage,
    generatedImage: result.generatedImage,
    preferences: result.preferences,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#1e2d52]"
        style={{ background: "#0d1230" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#1e2d52]">
          <h2 className="font-display text-xl font-bold text-[#FFF5E6]">
            Užsakyti montavimą
          </h2>
          <button onClick={onClose}
            className="p-2 text-[#C4A882] hover:text-[#FFF5E6] transition-colors rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <SuccessState onClose={onClose} />
          ) : (
            <>
              {/* Design preview */}
              <div className="flex gap-4 mb-8 p-4 rounded-xl border border-[rgba(201,162,39,0.2)] bg-[rgba(201,162,39,0.05)]">
                <div className="w-24 shrink-0 rounded-lg overflow-hidden" style={{ height: 72 }}>
                  <img src={result.generatedImage} alt="Jūsų Kalėdinis dizainas"
                    className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs text-[#C9A227] font-semibold uppercase tracking-wider mb-1">
                    Jūsų Kalėdinis dizainas
                  </p>
                  <p className="text-sm text-[#FFF5E6] font-medium capitalize">
                    {result.preferences.style.replace(/-/g, " ")} · {result.preferences.decorationLevel} puošyba
                  </p>
                  <p className="text-sm text-[#E8C84A] font-semibold mt-1">
                    Apytiksliai €{result.estimatedPriceMin}–€{result.estimatedPriceMax}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField icon={User} label="Vardas ir pavardė" required>
                    <input type="text" placeholder="Rūta Kazlauskienė" required
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="form-input" />
                  </FormField>
                  <FormField icon={Phone} label="Telefono numeris" required>
                    <input type="tel" placeholder="+370 600 00 000" required
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="form-input" />
                  </FormField>
                </div>

                <FormField icon={Mail} label="El. pašto adresas" required>
                  <input type="email" placeholder="ruta@example.com" required
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input" />
                </FormField>

                <FormField icon={MapPin} label="Namo adresas" required>
                  <input type="text" placeholder="Gedimino pr. 9" required
                    value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="form-input" />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField icon={MapPin} label="Miestas" required>
                    <select required value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="form-input">
                      <option value="">Pasirinkite miestą...</option>
                      <option>Vilnius</option>
                      <option>Kaunas</option>
                      <option>Klaipėda</option>
                      <option>Šiauliai</option>
                      <option>Panevėžys</option>
                      <option>Kitas</option>
                    </select>
                  </FormField>
                  <FormField icon={Calendar} label="Pageidaujama montavimo data">
                    <input type="date" value={form.installationDate}
                      onChange={(e) => setForm({ ...form, installationDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="form-input" />
                  </FormField>
                </div>

                <FormField icon={null} label="Papildomos pastabos">
                  <textarea rows={3}
                    placeholder="Ypatingi reikalavimai, prieigos pastabos ar klausimai..."
                    value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="form-input resize-none" />
                </FormField>

                <button type="submit" disabled={loading}
                  className={`btn-gold w-full justify-center text-base py-4 ${loading ? "opacity-70" : ""}`}>
                  {loading ? (
                    <><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></>
                  ) : (
                    <><Sparkles className="w-5 h-5" />Užsakyti montavimą</>
                  )}
                </button>

                <p className="text-xs text-center text-[#C4A882]/60">
                  Peržiūrėsime jūsų dizainą ir per 24 valandas susisieksime su galutine kaina ir laisvomis datomis.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 10px 14px;
          background: #131c35;
          border: 1px solid #1e2d52;
          border-radius: 10px;
          color: #FFF5E6;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: rgba(201, 162, 39, 0.5); }
        .form-input::placeholder { color: rgba(196, 168, 130, 0.4); }
        select.form-input option { background: #0d1230; }
      `}</style>
    </div>
  );
}

function FormField({ icon: Icon, label, required, children }: {
  icon: any; label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#C4A882] uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-[#C9A227]">*</span>}
      </label>
      {children}
    </div>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)" }}>
        <CheckCircle className="w-10 h-10 text-[#C9A227]" />
      </div>
      <h3 className="font-display text-2xl font-bold text-[#FFF5E6] mb-3">
        Jūsų Kalėdinė transformacija jau arti 🎄
      </h3>
      <p className="text-[#C4A882] mb-8 max-w-md mx-auto">
        Peržiūrėsime jūsų dizainą ir per 24 valandas susisieksime su galutine kaina bei laisvomis montavimo datomis.
      </p>
      <div className="space-y-3 max-w-xs mx-auto text-sm text-[#C4A882] mb-8">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
          Jūsų dizainas išsaugotas
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
          Komanda peržiūrės jūsų namo nuotrauką
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
          Susisieksime per 24 val. telefonu arba el. paštu
        </div>
      </div>
      <button onClick={onClose} className="btn-outline px-8 py-3">Uždaryti</button>
    </div>
  );
}
