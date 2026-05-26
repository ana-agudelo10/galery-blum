import { useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  nombre: string;
  descripcion: string;
  precio: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useEffect(() => {
    const loadSaved = async () => {
      const { value } = await Preferences.get({ key: PHOTO_STORAGE });
      const savedPhotos = (value ? JSON.parse(value) : []) as UserPhoto[];
      for (let photo of savedPhotos) {
        try {
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
          });
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        } catch (e) {
          console.error('Error cargando foto:', e);
        }
      }
      setPhotos(savedPhotos);
    };
    loadSaved();
  }, []);

  const addPhoto = (photo: UserPhoto) => {
    const newPhotos = [photo, ...photos];
    setPhotos(newPhotos);
    Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
  };

  const deletePhoto = async (photo: UserPhoto) => {
    const newPhotos = photos.filter(p => p.filepath !== photo.filepath);
    setPhotos(newPhotos);
    Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    try {
      await Filesystem.deleteFile({ path: photo.filepath, directory: Directory.Data });
    } catch (e) {
      console.error('Error eliminando:', e);
    }
  };

  return { photos, addPhoto, deletePhoto };
}