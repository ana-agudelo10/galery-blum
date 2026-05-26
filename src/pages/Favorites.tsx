import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent,
  IonCard, IonImg, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonIcon
} from '@ionic/react';
import { heartDislike, cartOutline } from 'ionicons/icons';
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { useIonViewWillEnter } from '@ionic/react';
import './Tab1.css';

const PHOTO_STORAGE = 'blum_photos';

const Favorites: React.FC = () => {
  const { favorites, toggleFavorite, addToCart } = usePhotoGallery();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useIonViewWillEnter(() => {
    const load = async () => {
      const { value } = await Preferences.get({ key: PHOTO_STORAGE });
      const saved: UserPhoto[] = value ? JSON.parse(value) : [];
      for (let photo of saved) {
        try {
          const file = await Filesystem.readFile({ path: photo.filepath, directory: Directory.Data });
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        } catch {}
      }
      setPhotos(saved);
    };
    load();
  });

  const favPhotos = photos.filter(p => favorites.includes(p.filepath));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <div className="blum-header">
            <img src="/Logo.png" className="blum-logo-img" alt="Blum" />
            <span className="blum-subtitle">MIS FAVORITOS ❤️</span>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="blum-content">
        {favPhotos.length === 0 ? (
          <div className="blum-empty">
            <p className="blum-empty-icon">🤍</p>
            <p className="blum-empty-title">No tienes favoritos aún</p>
            <p className="blum-empty-text">Agrega productos desde el Catálogo</p>
          </div>
        ) : (
          <div className="blum-grid">
            {favPhotos.map((photo, i) => (
              <IonCard key={i} className="blum-card">
                <IonImg src={photo.webviewPath} className="blum-card-img" />
                <IonCardHeader>
                  <IonCardTitle className="blum-card-title">{photo.nombre}</IonCardTitle>
                  <span className="blum-badge">${photo.precio}</span>
                </IonCardHeader>
                <IonCardContent className="blum-card-description">{photo.descripcion}</IonCardContent>
                <div className="blum-card-actions">
                  <IonButton fill="clear" color="danger" onClick={() => toggleFavorite(photo.filepath)}>
                    <IonIcon icon={heartDislike} />
                  </IonButton>
                  <IonButton fill="clear" color="primary" onClick={() => { addToCart(photo); alert('Agregado al carrito 🛒'); }}>
                    <IonIcon icon={cartOutline} />
                  </IonButton>
                </div>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;