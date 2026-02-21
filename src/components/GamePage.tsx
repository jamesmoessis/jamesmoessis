import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Go: new () => {
      importObject: WebAssembly.Imports;
      run(instance: WebAssembly.Instance): Promise<void>;
    };
  }
}

export default function GamePage() {
  const [status, setStatus] = useState<"loading" | "running" | "error">("loading");
  const [error, setError] = useState<string>("");
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function loadWasm() {
      try {
        // Load wasm_exec.js (Go's WASM support)
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "/wasm_exec.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load wasm_exec.js"));
          document.head.appendChild(script);
        });

        const go = new window.Go();
        const result = await WebAssembly.instantiateStreaming(
          fetch("/game.wasm"),
          go.importObject,
        );
        setStatus("running");
        go.run(result.instance);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : String(err));
      }
    }

    loadWasm();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy">
      <a
        href="/"
        className="absolute top-6 left-6 font-mono text-sm text-teal hover:text-teal-light transition-colors"
      >
        &larr; Back
      </a>

      {status === "loading" && (
        <p className="font-mono text-slate">Loading game...</p>
      )}

      {status === "error" && (
        <p className="font-mono text-red-400">Error: {error}</p>
      )}
    </div>
  );
}
