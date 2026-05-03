"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CheckCircle
} from "lucide-react";

import PaymentMP from "@/components/PaymentMP";

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

interface ItemCarrito extends Producto {
  cantidad: number;
}

export default function ModuloCaja() {
  const [busqueda, setBusqueda] = useState("");
  const [productosDB, setProductosDB] = useState<Producto[]>([]);
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch("/api/productos");
      const data = await res.json();
      if (Array.isArray(data)) setProductosDB(data);
    } catch {
      console.error("Error al cargar productos");
    }
  };

  useEffect(() => {
    if (!busqueda) return setSugerencias([]);

    const filtrados = productosDB
      .filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
      .slice(0, 6);

    setSugerencias(filtrados);
  }, [busqueda, productosDB]);

  const agregarAlCarrito = (producto: Producto) => {
    const existe = carrito.find((i) => i._id === producto._id);

    if (existe) {
      if (existe.cantidad >= producto.stock) {
        alert("Sin stock");
        return;
      }

      setCarrito(
        carrito.map((i) =>
          i._id === producto._id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    setBusqueda("");
    setSugerencias([]);
  };

  const modificarCantidad = (id: string, delta: number) => {
    setCarrito(
      carrito.map((item) => {
        if (item._id === id) {
          const nueva = Math.max(1, item.cantidad + delta);
          if (delta > 0 && nueva > item.stock) return item;
          return { ...item, cantidad: nueva };
        }
        return item;
      })
    );
  };

  const confirmarVenta = async () => {
    if (!carrito.length) return;

    setCargando(true);

    try {
      const res = await fetch("/api/productos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrito }),
      });

      if (res.ok) {
        setVentaExitosa(true);
        setCarrito([]);
        await fetchProductos();
        setTimeout(() => setVentaExitosa(false), 2000);
      }
    } catch {
      alert("Error");
    } finally {
      setCargando(false);
    }
  };

  const total = carrito.reduce(
    (acc, i) => acc + i.precio * i.cantidad,
    0
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* IZQUIERDA */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* BUSCADOR */}
<div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative">
  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
    Buscador de Artículos
  </label>

  <div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />

    <input
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      placeholder="Ej: Coca Cola, Fernet..."
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
    />
  </div>

  {sugerencias.length > 0 && (
    <div className="absolute left-6 right-6 mt-2 bg-white border border-slate-200 shadow-2xl rounded-2xl z-20 overflow-hidden divide-y divide-slate-50">
      {sugerencias.map((p) => (
        <button
          key={p._id}
          onClick={() => agregarAlCarrito(p)}
          disabled={p.stock <= 0}
          className="w-full flex justify-between items-center p-4 hover:bg-indigo-50 transition-colors text-left"
        >
          <div>
            <p className={`font-bold uppercase text-sm ${p.stock <= 0 ? 'text-slate-300' : 'text-slate-800'}`}>
              {p.nombre}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
              {p.categoria} — Stock: {p.stock}
            </p>
          </div>

          <span className={`font-black ${p.stock <= 0 ? 'text-slate-300' : 'text-indigo-600'}`}>
            ${p.precio}
          </span>
        </button>
      ))}
    </div>
  )}
</div>

        {/* CARRITO */}
<div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex-1">

  {/* HEADER */}
  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
      Detalle de Venta
    </h3>

    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-md">
      {carrito.length} ITEMS
    </span>
  </div>

  {/* LISTA */}
  <div className="divide-y divide-slate-50 max-h-[420px] overflow-y-auto">

    {carrito.length === 0 ? (
      <div className="py-20 text-center text-slate-300">
        <ShoppingCart size={48} className="mx-auto mb-2 opacity-20" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Esperando productos...
        </p>
      </div>
    ) : (
      carrito.map((item) => (
        <div key={item._id} className="p-4 flex items-center justify-between group">

          {/* INFO */}
          <div className="flex-1">
            <p className="font-bold text-slate-800 uppercase text-sm">
              {item.nombre}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
              ${item.precio} c/u
            </p>
          </div>

          {/* ACCIONES */}
          <div className="flex items-center gap-6">

            {/* CONTROL CANTIDAD */}
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <button 
                onClick={() => modificarCantidad(item._id, -1)} 
                className="p-1 hover:text-indigo-600"
              >
                <Minus size={14} />
              </button>

              <span className="font-black text-slate-800 w-4 text-center text-sm">
                {item.cantidad}
              </span>

              <button 
                onClick={() => modificarCantidad(item._id, 1)} 
                className="p-1 hover:text-indigo-600"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* PRECIO */}
            <div className="w-20 text-right">
              <p className="font-black text-slate-900 text-sm">
                ${(item.precio * item.cantidad).toLocaleString()}
              </p>
            </div>

            {/* ELIMINAR */}
            <button
              onClick={() =>
                setCarrito(carrito.filter((i) => i._id !== item._id))
              }
              className="text-slate-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</div>
      </div>

      {/* DERECHA */}
<div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">

  {/* OVERLAY VENTA EXITOSA */}
  {ventaExitosa && (
    <div className="absolute inset-0 bg-emerald-500 flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
      <CheckCircle size={64} className="mb-4 animate-bounce" />
      <p className="font-black text-xl uppercase tracking-wider">
        Venta exitosa
      </p>
    </div>
  )}

  {/* HEADER + TOTAL */}
  <div>
    <div className="flex items-center gap-2 mb-8 opacity-40 uppercase tracking-[0.3em] text-[10px] font-bold">
      <Receipt size={14} />
      Ticket de pago
    </div>

    {/* RESUMEN */}
    <div className="space-y-6 mb-10">

      {/* SUBTOTAL */}
      <div className="flex justify-between items-center text-slate-400">
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Subtotal
        </span>
        <span className="font-mono tabular-nums">
          ${total.toLocaleString()}
        </span>
      </div>

      {/* TOTAL GRANDE */}
      <div className="border-t border-slate-800 pt-6">
        <p className="text-emerald-500 font-bold uppercase text-[10px] mb-2 tracking-widest">
          Total a cobrar
        </p>

        <div className="text-7xl font-black tracking-tighter text-white tabular-nums">
          <span className="text-2xl text-slate-600 mr-1">$</span>
          {total.toLocaleString()}
        </div>
      </div>

    </div>
  </div>

  {/* MÉTODO DE PAGO */}
  <div className="space-y-4">

    <PaymentMP
      carrito={carrito}
      onConfirm={confirmarVenta}
      loading={cargando}
    />

    {/* VACIAR */}
    <button
      onClick={() => setCarrito([])}
      disabled={!carrito.length}
      className="w-full py-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors disabled:opacity-30"
    >
      Vaciar carrito
    </button>

  </div>
</div>
    </div>
  );
}