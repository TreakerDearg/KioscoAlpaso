"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importante para refrescar la tabla
import { 
  X, Save, Tag, DollarSign, Box, Layers, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';

interface FormularioProps {
  alCerrar: () => void;
  datosEdicion?: any;
}

export default function FormularioProducto({ alCerrar, datosEdicion }: FormularioProps) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('comida');

  useEffect(() => {
    if (datosEdicion) {
      setNombre(datosEdicion.nombre);
      setPrecio(datosEdicion.precio.toString());
      setStock(datosEdicion.stock.toString());
      setCategoria(datosEdicion.categoria || 'comida');
    }
  }, [datosEdicion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true); // Bloqueamos el botón para evitar doble envío

    const payload = {
      nombre: nombre.trim().toUpperCase(),
      precio: Number(precio),
      stock: Number(stock),
      categoria
    };

    try {
      // Si tenemos datosEdicion, usamos PUT y pasamos el _id. Si no, POST.
      const url = '/api/productos';
      const metodo = datosEdicion ? 'PUT' : 'POST';
      const body = datosEdicion ? { ...payload, id: datosEdicion._id } : payload;

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        // ÉXITO: Refrescamos la página para que la tabla pida los datos nuevos
        router.refresh(); 
        window.location.reload(); // Forzamos recarga para ver los cambios inmediatamente
        alCerrar();
      } else {
        const errorData = await res.json();
        alert("Error del servidor: " + errorData.error);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("Error de conexión. Revisa si el servidor está corriendo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${datosEdicion ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'}`}>
              {datosEdicion ? <AlertCircle size={20} /> : <Box size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight">
                {datosEdicion ? 'Editar Registro' : 'Alta de Producto'}
              </h2>
            </div>
          </div>
          <button onClick={alCerrar} className="text-slate-400 hover:text-slate-600">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
              <Tag size={14} className="text-indigo-500" /> Nombre
            </label>
            <input 
              type="text" required value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-semibold"
              placeholder="EJ. YERBA MATE 500G"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
              <Layers size={14} className="text-indigo-500" /> Clasificación
            </label>
            <select 
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 outline-none text-slate-900 font-bold"
            >
              <option value="comida">ALIMENTOS</option>
              <option value="bebidas">BEBIDAS</option>
              <option value="limpieza">LIMPIEZA</option>
              <option value="otros">VARIOS</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
                <DollarSign size={14} className="text-indigo-500" /> Precio
              </label>
              <input 
                type="number" step="0.01" required value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 outline-none text-slate-900 font-black"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
                <Box size={14} className="text-indigo-500" /> Stock
              </label>
              <input 
                type="number" required value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 outline-none text-slate-900 font-black"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={alCerrar}
              className="flex-1 px-6 py-4 border-2 border-slate-100 rounded-2xl text-slate-500 font-bold"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={cargando}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-white shadow-xl transition-all ${
                datosEdicion ? 'bg-amber-500' : 'bg-indigo-600'
              } ${cargando ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {cargando ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={18} />
                  {datosEdicion ? 'ACTUALIZAR' : 'REGISTRAR'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}