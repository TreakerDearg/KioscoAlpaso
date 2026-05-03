"use client";

import { useState } from "react";
import {
  Package,
  ShoppingCart,
  Plus,
  LayoutDashboard,
  Store,
  ChevronRight
} from "lucide-react";

import TablaProductos from "@/components/TablaProductos";
import ResumenCaja from "@/components/ResumenCaja";
import FormularioProducto from "@/components/FormularioProducto";
import ModuloCaja from "@/components/ModuloCaja";

export default function InventarioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabActiva, setTabActiva] = useState<"inventario" | "caja">("inventario");
  const [productoAEditar, setProductoAEditar] = useState<any>(null);

  const manejarNuevoProducto = () => {
    setProductoAEditar(null);
    setIsModalOpen(true);
  };

  const manejarEditarProducto = (producto: any) => {
    setProductoAEditar(producto);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* 🔥 HEADER PREMIUM */}
        <header className="mb-12 flex flex-col lg:flex-row justify-between gap-8">

          {/* TITULO */}
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.25em] mb-2">
              <Store size={14} />
              Sistema Comercial
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {tabActiva === "inventario"
                ? "Gestión de Inventario"
                : "Terminal de Ventas"}
            </h1>

            <p className="text-slate-500 mt-2">
              Base de datos en tiempo real • Control total del negocio
            </p>
          </div>

          {/* 🔘 TABS MODERNOS */}
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 shadow-lg p-1.5 rounded-2xl flex">

            <button
              onClick={() => setTabActiva("inventario")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                tabActiva === "inventario"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Package size={18} />
              Inventario
            </button>

            <button
              onClick={() => setTabActiva("caja")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                tabActiva === "caja"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ShoppingCart size={18} />
              Caja
            </button>

          </div>
        </header>

        {/* CONTENIDO */}
        {tabActiva === "inventario" ? (
          <div className="space-y-10 animate-in fade-in duration-500">

            {/* RESUMEN + ACCIONES */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

              <div className="xl:col-span-3 bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
                <ResumenCaja />
              </div>

              <button
                onClick={manejarNuevoProducto}
                className="group flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-[2rem] shadow-xl hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Plus size={22} />
                  </div>
                  <ChevronRight className="opacity-40 group-hover:translate-x-1 transition" />
                </div>

                <div>
                  <p className="text-xs opacity-70 uppercase tracking-widest">
                    Acción rápida
                  </p>
                  <h3 className="font-black text-lg mt-1">
                    Nuevo Producto
                  </h3>
                </div>
              </button>

            </div>

            {/* TABLA */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">

              <div className="p-6 border-b bg-slate-50/50 flex items-center gap-3">
                <LayoutDashboard size={18} className="text-slate-400" />
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  Productos Registrados
                </h2>
              </div>

              <TablaProductos onEditar={manejarEditarProducto} />

            </div>
          </div>

        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl border border-slate-100">
              <ModuloCaja />
            </div>
          </div>
        )}

        {/* BOTON MOBILE */}
        {tabActiva === "inventario" && (
          <button
            onClick={manejarNuevoProducto}
            className="md:hidden fixed bottom-8 right-8 bg-indigo-600 text-white p-5 rounded-full shadow-2xl z-40 active:scale-90 border-4 border-white"
          >
            <Plus size={28} />
          </button>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <FormularioProducto
            alCerrar={() => setIsModalOpen(false)}
            datosEdicion={productoAEditar}
          />
        )}

        {/* FOOTER MODERNO */}
        <footer className="mt-16 flex justify-center">
          <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 shadow-lg rounded-full text-[11px] font-semibold text-slate-500">

            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistema operativo

            <span className="text-slate-300">•</span>
            Latencia 24ms

            <span className="text-slate-300">•</span>
            v1.0 POS

          </div>
        </footer>

      </div>
    </main>
  );
}