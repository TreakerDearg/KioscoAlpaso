"use client";
import { useState, useEffect } from 'react';
import { 
  Search, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Layers, 
  Filter,
  Package2,
  Loader2
} from 'lucide-react';

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

interface TablaProps {
  onEditar: (producto: Producto) => void;
}

export default function TablaProductos({ onEditar }: TablaProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [pagina, setPagina] = useState(1);

  // 1. CARGAR PRODUCTOS DESDE LA API
  const cargarProductos = async () => {
    try {
      setCargando(true);
      const res = await fetch('/api/productos');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProductos(data);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // 2. ELIMINAR PRODUCTO
  const eliminarProducto = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch(`/api/productos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Filtramos el estado local para quitar el producto borrado sin recargar toda la página
        setProductos(productos.filter(p => p._id !== id));
      } else {
        alert("Error al eliminar el producto");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Lógica de Filtrado
  const productosFiltrados = productos.filter(prod => {
    const coincideNombre = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === 'todos' || prod.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  // Paginación
  const itemsPorPagina = 8; // Aumentado para mejor uso de pantalla
  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const inicio = (pagina - 1) * itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(inicio, inicio + itemsPorPagina);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs">Accediendo al Inventario...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Barra de Filtros */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Filtrar por nombre..."
            className="border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 w-full outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 transition-all bg-slate-50/50 focus:bg-white"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-400 hidden md:block" />
          <select 
            className="border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-600 bg-slate-50 font-semibold cursor-pointer hover:bg-slate-100 transition-colors w-full md:w-auto text-sm"
            value={categoria}
            onChange={(e) => { setCategoria(e.target.value); setPagina(1); }}
          >
            <option value="todos">TODAS LAS CATEGORÍAS</option>
            <option value="bebidas">BEBIDAS</option>
            <option value="comida">ALIMENTOS</option>
            <option value="limpieza">LIMPIEZA</option>
            <option value="otros">VARIOS</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest">
                <div className="flex items-center gap-2">
                   <Package2 size={14} /> Producto
                </div>
              </th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-center">Valor Unitario</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-center">Disponibilidad</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-right pr-6">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {productosPaginados.length > 0 ? (
              productosPaginados.map((prod) => (
                <tr key={prod._id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-bold text-sm uppercase tracking-tight">{prod.nombre}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Layers size={10} className="text-indigo-400" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{prod.categoria}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-slate-700 font-mono font-bold text-sm">
                      ${prod.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${prod.stock < 10 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <span className={`text-sm font-bold ${prod.stock < 10 ? 'text-amber-700' : 'text-slate-600'}`}>
                        {prod.stock} UN.
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => onEditar(prod)}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => eliminarProducto(prod._id, prod.nombre)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-24 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <Search size={64} strokeWidth={1} />
                    <p className="mt-4 font-bold text-slate-900 uppercase tracking-widest text-xs">Sin registros</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="p-5 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/40">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Total Base de Datos: {productosFiltrados.length}
        </p>
        
        <div className="flex items-center gap-3">
          <button 
            disabled={pagina === 1}
            onClick={() => setPagina(p => p - 1)}
            className="p-2 border border-slate-200 rounded-xl bg-white disabled:opacity-30 text-slate-500"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="px-4 text-xs font-black text-slate-600 uppercase">
            Pág. {pagina} / {totalPaginas || 1}
          </div>

          <button 
            disabled={pagina >= totalPaginas}
            onClick={() => setPagina(p => p + 1)}
            className="p-2 border border-slate-200 rounded-xl bg-white disabled:opacity-30 text-slate-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}