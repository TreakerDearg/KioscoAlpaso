"use client";

import { useState } from "react";
import { QrCode, Copy, CheckCircle, Loader2 } from "lucide-react";

interface Props {
  carrito: unknown[];
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export default function PaymentLocal({ carrito, onConfirm, loading }: Props) {
  const [copiado, setCopiado] = useState(false);

  const alias = "MyLadyArgel";

  const copiarAlias = () => {
    navigator.clipboard.writeText(alias);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-5">

      {/* QR */}
      <div className="bg-white rounded-2xl p-4 text-center border">
        <p className="text-xs text-slate-400 mb-2 uppercase">
          Escanear QR
        </p>

        <QrCode size={120} className="mx-auto text-slate-300" />

        <p className="text-xs text-slate-400 mt-2">
          Abrir Mercado Pago
        </p>
      </div>

      {/* Alias */}
      <div className="bg-slate-800 text-white p-4 rounded-2xl text-center">
        <p className="text-xs opacity-60 mb-1 uppercase">
          Alias
        </p>

        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-lg">{alias}</span>

          <button onClick={copiarAlias}>
            {copiado ? "✓" : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Confirmación */}
      <button
        disabled={carrito.length === 0 || loading}
        onClick={onConfirm}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <CheckCircle size={20} />
            Confirmar Pago
          </>
        )}
      </button>
    </div>
  );
}