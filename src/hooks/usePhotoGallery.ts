import { useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  nombre: string;
  descripcion: string;
  precio: string;
  ownerId: string;
}

export interface CartItem {
  photo: UserPhoto;
  cantidad: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  clientEmail: string;
  clientName: string;
  total: string;
  status: 'pendiente' | 'enviado';
  date: string;
}

const PHOTO_STORAGE = 'blum_photos';
const FAVORITES_STORAGE = 'blum_favorites';
const CART_STORAGE = 'blum_cart';
const ORDERS_STORAGE = 'blum_orders';

async function loadPhotosFromStorage(): Promise<UserPhoto[]> {
  const { value } = await Preferences.get({ key: PHOTO_STORAGE });
  const saved: UserPhoto[] = value ? JSON.parse(value) : [];
  for (let photo of saved) {
    try {
      const file = await Filesystem.readFile({ path: photo.filepath, directory: Directory.Data });
      photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
    } catch {}
  }
  return saved;
}

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const load = async () => {
      const savedPhotos = await loadPhotosFromStorage();
      const { value: favVal } = await Preferences.get({ key: FAVORITES_STORAGE });
      const { value: cartVal } = await Preferences.get({ key: CART_STORAGE });
      const { value: ordersVal } = await Preferences.get({ key: ORDERS_STORAGE });
      setPhotos(savedPhotos);
      setFavorites(favVal ? JSON.parse(favVal) : []);
      setCart(cartVal ? JSON.parse(cartVal) : []);
      setOrders(ordersVal ? JSON.parse(ordersVal) : []);
    };
    load();
  }, []);

  const reloadPhotos = async () => {
    const saved = await loadPhotosFromStorage();
    setPhotos(saved);
  };

  const addPhoto = async (photo: UserPhoto) => {
    const { value } = await Preferences.get({ key: PHOTO_STORAGE });
    const current: UserPhoto[] = value ? JSON.parse(value) : [];
    const newPhotos = [photo, ...current];
    await Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    const withImages = await loadPhotosFromStorage();
    setPhotos(withImages);
  };

  const deletePhoto = async (photo: UserPhoto) => {
    const { value } = await Preferences.get({ key: PHOTO_STORAGE });
    const current: UserPhoto[] = value ? JSON.parse(value) : [];
    const newPhotos = current.filter(p => p.filepath !== photo.filepath);
    await Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    setPhotos(prev => prev.filter(p => p.filepath !== photo.filepath));
    try { await Filesystem.deleteFile({ path: photo.filepath, directory: Directory.Data }); } catch {}
  };

  const toggleFavorite = async (filepath: string) => {
    const updated = favorites.includes(filepath)
      ? favorites.filter(f => f !== filepath)
      : [...favorites, filepath];
    setFavorites(updated);
    await Preferences.set({ key: FAVORITES_STORAGE, value: JSON.stringify(updated) });
  };

  const addToCart = async (photo: UserPhoto) => {
    const existing = cart.find(c => c.photo.filepath === photo.filepath);
    const updated = existing
      ? cart.map(c => c.photo.filepath === photo.filepath ? { ...c, cantidad: c.cantidad + 1 } : c)
      : [...cart, { photo, cantidad: 1 }];
    setCart(updated);
    await Preferences.set({ key: CART_STORAGE, value: JSON.stringify(updated) });
  };

  const removeFromCart = async (filepath: string) => {
    const updated = cart.filter(c => c.photo.filepath !== filepath);
    setCart(updated);
    await Preferences.set({ key: CART_STORAGE, value: JSON.stringify(updated) });
  };

  const checkout = async (clientEmail: string, clientName: string) => {
    if (cart.length === 0) return false;
    const total = cart.reduce((sum, c) => sum + parseFloat(c.photo.precio) * c.cantidad, 0).toFixed(2);
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      clientEmail,
      clientName,
      total,
      status: 'pendiente',
      date: new Date().toLocaleDateString('es-CO')
    };
    const { value } = await Preferences.get({ key: ORDERS_STORAGE });
    const currentOrders: Order[] = value ? JSON.parse(value) : [];
    const newOrders = [newOrder, ...currentOrders];
    setOrders(newOrders);
    setCart([]);
    await Preferences.set({ key: ORDERS_STORAGE, value: JSON.stringify(newOrders) });
    await Preferences.set({ key: CART_STORAGE, value: JSON.stringify([]) });
    return true;
  };

  const reloadOrders = async () => {
    const { value } = await Preferences.get({ key: ORDERS_STORAGE });
    setOrders(value ? JSON.parse(value) : []);
  };

  const updateOrderStatus = async (id: string, status: 'pendiente' | 'enviado') => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    await Preferences.set({ key: ORDERS_STORAGE, value: JSON.stringify(updated) });
  };

  return {
    photos, addPhoto, deletePhoto, reloadPhotos,
    favorites, toggleFavorite,
    cart, addToCart, removeFromCart, checkout,
    orders, reloadOrders, updateOrderStatus
  };
}