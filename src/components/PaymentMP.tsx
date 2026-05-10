"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

import {
  QrCode,
  Copy,
  CheckCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface Props {
  carrito: unknown[];
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export default function PaymentLocal({
  carrito,
  onConfirm,
  loading = false,
}: Props) {
  const [copiado, setCopiado] = useState(false);

  // Alias de cobro
  const alias = "MyLadyArgel";

  // Link real de pago
  const paymentLink =
    "https://onetouch.astropay.com/payment?external_reference_id=I6GP8aXDdXhyQXwLznFZk2KhdQ3UQHpQ";

  const copiarAlias = async () => {
    try {
      await navigator.clipboard.writeText(alias);

      setCopiado(true);

      setTimeout(() => {
        setCopiado(false);
      }, 2000);
    } catch (error) {
      console.error("Error al copiar alias", error);
    }
  };

  return (
    <div className="space-y-5">

      {/* QR CARD */}
      <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Pago QR
            </p>

            <h3 className="text-lg font-black text-slate-900 mt-1">
              Escanear código
            </h3>
          </div>

          {/* ICONO */}
          <div className="bg-slate-100 p-3 rounded-2xl">
            <QrCode size={22} className="text-slate-700" />
          </div>
        </div>

        {/* QR REAL */}
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-5 flex justify-center items-center overflow-hidden">

          <div className="w-full max-w-[220px]">
            <QRCode
              value={paymentLink}
              size={220}
              style={{
                width: "100%",
                height: "auto",
              }}
              viewBox={`0 0 256 256`}
            />
          </div>

        </div>

        {/* INFO */}
        <div className="mt-4 text-center">
          <p className="text-xs font-medium text-slate-500">
            Escaneá con Mercado Pago o AstroPay
          </p>
        </div>
      </div>

      {/* ALIAS */}
      <div className="bg-slate-900 rounded-[2rem] p-5 text-white shadow-sm">

        <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-black mb-3">
          Alias de pago
        </p>

        <div className="flex items-center justify-between gap-3 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">

          <span className="font-mono text-lg tracking-wide truncate">
            {alias}
          </span>

          <button
            type="button"
            onClick={copiarAlias}
            className="bg-slate-700 hover:bg-slate-600 transition-all p-2 rounded-xl shrink-0"
          >
            {copiado ? (
              <CheckCircle
                size={18}
                className="text-emerald-400"
              />
            ) : (
              <Copy size={18} />
            )}
          </button>

        </div>
      </div>

      {/* ABRIR LINK */}
      <a
        href={paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] text-white py-4 rounded-2xl font-black transition-all shadow-lg"
      >
        <ExternalLink size={18} />
        Abrir Link de Pago
      </a>

      {/* CONFIRMAR */}
      <button
        type="button"
        disabled={carrito.length === 0 || loading}
        onClick={onConfirm}
        className="
          w-full
          bg-emerald-500
          hover:bg-emerald-600
          disabled:bg-slate-300
          disabled:text-slate-500
          disabled:cursor-not-allowed
          text-white
          py-5
          rounded-2xl
          font-black
          flex
          items-center
          justify-center
          gap-3
          transition-all
          shadow-lg
          uppercase
          tracking-wide
        "
      >
        {loading ? (
          <>
            <Loader2
              className="animate-spin"
              size={20}
            />
            Procesando...
          </>
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