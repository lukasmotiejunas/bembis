"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Camera, ImageIcon, X, AlertCircle } from "lucide-react";

interface UploadStepProps {
  onImageUploaded: (imageDataUrl: string) => void;
}

export default function UploadStep({ onImageUploaded }: UploadStepProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    if (rejectedFiles.length > 0) {
      setError("Prašome įkelti JPG, PNG arba HEIC nuotrauką, ne didesnę nei 20 MB.");
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "image/heif": [".heif"],
    },
    maxSize: 20 * 1024 * 1024,
    maxFiles: 1,
    noClick: !!preview,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl font-bold text-[#FFF5E6] mb-3">
          Įkelkite savo namą
        </h2>
        <p className="text-[#C4A882]">
          Įkelkite aiškią, priekinę jūsų namo nuotrauką. Kuo geresnė nuotrauka, tuo tikslesnė Kalėdinė peržiūra.
        </p>
      </div>

      {!preview ? (
        <div
          {...getRootProps()}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
            isDragActive
              ? "border-[#C9A227] bg-[rgba(201,162,39,0.08)]"
              : "border-[#1e2d52] hover:border-[rgba(201,162,39,0.5)] hover:bg-[rgba(201,162,39,0.03)]"
          }`}
          style={{ minHeight: 300 }}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
              style={{
                background: isDragActive ? "rgba(201,162,39,0.2)" : "rgba(201,162,39,0.08)",
                border: "1px solid rgba(201,162,39,0.2)",
              }}
            >
              {isDragActive ? (
                <ImageIcon className="w-9 h-9 text-[#C9A227]" />
              ) : (
                <Upload className="w-9 h-9 text-[#C9A227]" />
              )}
            </div>

            {isDragActive ? (
              <p className="text-lg font-semibold text-[#E8C84A]">
                Numeskite nuotrauką čia
              </p>
            ) : (
              <>
                <p className="text-lg font-semibold text-[#FFF5E6] mb-2">
                  Vilkite ir numeskite savo namo nuotrauką
                </p>
                <p className="text-sm text-[#C4A882] mb-6">
                  arba spauskite norėdami pasirinkti — JPG, PNG, HEIC iki 20 MB
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={open}
                    className="btn-gold text-sm px-6 py-2.5"
                    type="button"
                  >
                    <Upload className="w-4 h-4" />
                    Pasirinkti nuotrauką
                  </button>
                  <label className="btn-outline text-sm px-6 py-2.5 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    Nufotografuoti
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setPreview(ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-[rgba(201,162,39,0.3)]">
          <div className="relative">
            <img
              src={preview}
              alt="Jūsų namas"
              className="w-full max-h-96 object-contain bg-[#0d1230]"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center text-white hover:bg-[rgba(0,0,0,0.9)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[rgba(0,0,0,0.7)] text-white backdrop-blur-sm">
                Jūsų namas
              </span>
            </div>
          </div>
          <div className="p-4 bg-[#131c35]">
            <p className="text-sm text-[#C4A882] flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Nuotrauka įkelta sėkmingai. Puikiai!
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <p className="mt-6 text-xs text-center text-[#C4A882]/60 flex items-center justify-center gap-1.5">
        <span>🔒</span>
        Jūsų nuotrauka naudojama tik Kalėdinei vizualizacijai sukurti ir montavimo užklausai parengti.{" "}
        <a href="#" className="underline hover:text-[#C4A882] transition-colors">Privatumo politika</a>
      </p>

      {preview && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onImageUploaded(preview)}
            className="btn-gold text-base px-10 py-4"
          >
            Pasirinkti Kalėdinį stilių →
          </button>
        </div>
      )}
    </div>
  );
}
