"use client";
import { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Plus, 
  LayoutDashboard, 
  Store, 
  ChevronRight 
} from 'lucide-react';
import TablaProductos from '@/components/TablaProductos';
import ResumenCaja from '@/components/ResumenCaja';
import FormularioProducto from '@/components/FormularioProducto';
import ModuloCaja from '@/components/ModuloCaja';

export default function InventarioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabActiva, setTabActiva] = useState<'inventario' | 'caja'>('inventario');
  const [productoAEditar, setProductoAEditar] = useState<any>(null);

  // Función para abrir el modal (Nuevo Producto)
  const manejarNuevoProducto = () => {
    setProductoAEditar(null);
    setIsModalOpen(true);
  };

  // Función para abrir el modal (Editar Producto)
  const manejarEditarProducto = (producto: any) => {
    setProductoAEditar(producto);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- CABECERA SUPERIOR --- */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-1">
              <Store size={14} /> Sistema de Gestión Real
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              {tabActiva === 'inventario' ? 'Panel de Stock' : 'Terminal de Venta'}
            </h1>
            <p className="text-slate-500 font-medium">
              Conectado a <span className="text-slate-800 font-bold">MongoDB Atlas</span> • Sucursal Central
            </p>
          </div>

          {/* Selector de Pestañas Estilo Moderno */}
          <div className="bg-slate-200/50 p-1.5 rounded-2xl flex items-center backdrop-blur-sm border border-slate-200">
            <button 
              onClick={() => setTabActiva('inventario')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                tabActiva === 'inventario' 
                ? 'bg-white text-indigo-600 shadow-md transform scale-105' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Package size={18} />
              INVENTARIO
            </button>
            <button 
              onClick={() => setTabActiva('caja')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                tabActiva === 'caja' 
                ? 'bg-white text-emerald-600 shadow-md transform scale-105' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShoppingCart size={18} />
              CAJA POS
            </button>
          </div>
        </header>

        {/* --- CONTENIDO SEGÚN TAB --- */}
        <div className="relative">
          {tabActiva === 'inventario' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              
              {/* Sección de Resumen y Acciones */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-center">
                <div className="xl:col-span-3">
                  <ResumenCaja />
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={manejarNuevoProducto}
                    className="group w-full flex items-center justify-between bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-5 rounded-[2rem] font-black shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-xl">
                        <Plus size={20} />
                      </div>
                      <span className="tracking-tight">NUEVO PRODUCTO</span>
                    </div>
                    <ChevronRight size={18} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Contenedor de Tabla */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
                  <LayoutDashboard size={18} className="text-slate-400" />
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Base de Datos de Artículos</h2>
                </div>
                <TablaProductos onEditar={manejarEditarProducto} />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Módulo de Caja */}
              <ModuloCaja />
            </div>
          )}
        </div>

        {/* Botón flotante móvil para Inventario */}
        {tabActiva === 'inventario' && (
          <button 
            onClick={manejarNuevoProducto}
            className="md:hidden fixed bottom-8 right-8 bg-indigo-600 text-white p-5 rounded-full shadow-2xl z-40 active:scale-90 transition-all border-4 border-white"
          >
            <Plus size={28} />
          </button>
        )}

        {/* Modal Único para Crear/Editar */}
        {isModalOpen && (
          <FormularioProducto 
            alCerrar={() => setIsModalOpen(false)} 
            datosEdicion={productoAEditar}
          />
        )}
      </div>

      {/* Footer de Estado */}
      <footer className="max-w-7xl mx-auto mt-12 pb-8 flex justify-center">
        <div className="flex items-center gap-4 px-6 py-2 bg-slate-200/50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          Servidor Online
          <span className="text-slate-300">|</span>
          Latencia: 24ms
          <span className="text-slate-300">|</span>
          © 2024 Sistema Local
        </div>
      </footer>
    </main>
  );
}