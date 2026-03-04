"use client";
import { useState, useEffect } from 'react';
import { Box, DollarSign, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';

export default function ResumenCaja() {
  const [metricas, setMetricas] = useState({
    totalStock: 0,
    valorTotal: 0,
    productosBajoStock: 0,
    totalItems: 0
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const calcularMetricas = async () => {
      try {
        const res = await fetch('/api/productos');
        const productos = await res.json();

        if (Array.isArray(productos)) {
          const stats = productos.reduce((acc, prod) => {
            acc.totalStock += prod.stock;
            acc.valorTotal += (prod.precio * prod.stock);
            acc.totalItems += 1;
            if (prod.stock < 10) acc.productosBajoStock += 1;
            return acc;
          }, { totalStock: 0, valorTotal: 0, productosBajoStock: 0, totalItems: 0 });

          setMetricas(stats);
        }
      } catch (error) {
        console.error("Error al calcular resumen:", error);
      } finally {
        setCargando(false);
      }
    };

    calcularMetricas();
    // Escuchar cambios cada vez que se refresca la página
  }, []);

  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white h-24 rounded-2xl animate-pulse border border-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* TARJETA: VALOR TOTAL */}
      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-all">
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor de Activos</p>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
            ${metricas.valorTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </h2>
        </div>
      </div>

      {/* TARJETA: STOCK TOTAL */}
      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-all">
        <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
          <Box size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidades Totales</p>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
            {metricas.totalStock} <span className="text-sm font-bold text-slate-400">PZS</span>
          </h2>
        </div>
      </div>

      {/* TARJETA: ALERTAS DE STOCK */}
      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-amber-200 transition-all">
        <div className={`p-4 rounded-2xl transition-all ${
          metricas.productosBajoStock > 0 
          ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' 
          : 'bg-slate-50 text-slate-400'
        }`}>
          {metricas.productosBajoStock > 0 ? <AlertTriangle size={24} /> : <TrendingUp size={24} />}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faltantes Críticos</p>
          <h2 className={`text-2xl font-black tracking-tighter ${
            metricas.productosBajoStock > 0 ? 'text-amber-600' : 'text-slate-800'
          }`}>
            {metricas.productosBajoStock} <span className="text-sm font-bold opacity-60">PROD.</span>
          </h2>
        </div>
      </div>

    </div>
  );
}