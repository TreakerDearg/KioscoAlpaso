"use client";

import { useState } from "react";
import { QrCode, Copy, CheckCircle } from "lucide-react";

interface Props {
  carrito: any[];
  onPagoConfirmado: () => void;
}

export default function PaymentLocal({ carrito, onPagoConfirmado }: Props) {
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
      <div className="bg-white rounded-2xl p-4 text-center">
        <p className="text-xs text-slate-400 mb-2 uppercase">
          Escanear QR
        </p>

        <img
          src="/qr-mercadopago.png"
          className="mx-auto w-40 h-40"
          alt="QR"
        />

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

      {/* Confirmación manual */}
      <button
        disabled={carrito.length === 0}
        onClick={onPagoConfirmado}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
      >
        <CheckCircle size={20} />
        Confirmar Pago
      </button>
    </div>
  );
}