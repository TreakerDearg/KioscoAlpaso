import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// 1. OBTENER TODOS LOS PRODUCTOS
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('inventario_db');
    
    const productos = await db
      .collection('productos')
      .find({})
      .sort({ fechaCreacion: -1 })
      .toArray();
    
    return NextResponse.json(productos);
  } catch (e) {
    console.error("Error en GET:", e);
    return NextResponse.json({ error: 'Fallo al obtener productos' }, { status: 500 });
  }
}

// 2. CREAR UN NUEVO PRODUCTO
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('inventario_db');
    
    const nuevoProducto = {
      nombre: body.nombre.trim().toUpperCase(),
      precio: Number(body.precio),
      stock: Number(body.stock),
      categoria: body.categoria,
      fechaCreacion: new Date()
    };

    const resultado = await db.collection('productos').insertOne(nuevoProducto);

    return NextResponse.json({ 
      message: 'Producto registrado', 
      id: resultado.insertedId 
    });
  } catch (e) {
    console.error("Error en POST:", e);
    return NextResponse.json({ error: 'Fallo al guardar producto' }, { status: 500 });
  }
}

// 3. ACTUALIZAR UN PRODUCTO EXISTENTE (Inventario)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...datosActualizados } = body;

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('inventario_db');
    
    const updatePayload = {
      nombre: datosActualizados.nombre.trim().toUpperCase(),
      precio: Number(datosActualizados.precio),
      stock: Number(datosActualizados.stock),
      categoria: datosActualizados.categoria,
      fechaUltimaEdicion: new Date()
    };

    const resultado = await db.collection('productos').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatePayload }
    );

    if (resultado.matchedCount === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Producto actualizado con éxito' });
  } catch (e) {
    console.error("Error en PUT:", e);
    return NextResponse.json({ error: 'Fallo al actualizar' }, { status: 500 });
  }
}

// 4. PROCESAR VENTA (Descontar stock masivamente)
export async function PATCH(request: Request) {
  try {
    const { carrito } = await request.json();
    const client = await clientPromise;
    const db = client.db('inventario_db');

    if (!carrito || carrito.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 });
    }

    // Preparamos las operaciones masivas para MongoDB
    const operaciones = carrito.map((item: any) => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: { $inc: { stock: -Math.abs(item.cantidad) } }, // Restamos la cantidad vendida
      }
    }));

    // Ejecutamos todas las actualizaciones en una sola llamada al servidor
    await db.collection('productos').bulkWrite(operaciones);

    // Registramos la venta en el historial para consultas futuras
    await db.collection('ventas').insertOne({
      items: carrito.map((i: any) => ({
        id: i._id,
        nombre: i.nombre,
        cantidad: i.cantidad,
        precioUnitario: i.precio
      })),
      total: carrito.reduce((acc: number, item: any) => acc + (item.precio * item.cantidad), 0),
      fecha: new Date()
    });

    return NextResponse.json({ message: 'Venta procesada y stock actualizado' });
  } catch (e) {
    console.error("Error en PATCH (Venta):", e);
    return NextResponse.json({ error: 'Error al procesar la transacción' }, { status: 500 });
  }
}

// 5. ELIMINAR UN PRODUCTO
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('inventario_db');
    
    const resultado = await db.collection('productos').deleteOne({
      _id: new ObjectId(id)
    });

    if (resultado.deletedCount === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Producto eliminado' });
  } catch (e) {
    console.error("Error en DELETE:", e);
    return NextResponse.json({ error: 'Fallo al eliminar' }, { status: 500 });
  }
}