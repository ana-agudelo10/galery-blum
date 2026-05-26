import React, { useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonToolbar,
  IonCard, IonImg, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonButton,
  IonIcon, IonActionSheet
} from '@ionic/react';
import { trash, close, cartOutline, heart, heartOutline } from 'ionicons/icons';
import { useIonViewWillEnter } from '@ionic/react';
import { UserPhoto, usePhotoGallery } from '../hooks/usePhotoGallery';
import { useAuth } from '../context/AuthContext';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import './Tab1.css';

const PHOTO_STORAGE = 'blum_photos';

const Tab1: React.FC = () => {
  const { deletePhoto, favorites, toggleFavorite, addToCart } = usePhotoGallery();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();

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

  const visiblePhotos = user?.role === 'seller'
    ? photos.filter(p => p.ownerId === user.email)
    : photos;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <div className="blum-header">
            <img src="/Logo.png" className="blum-logo-img" alt="Blum" />
            <span className="blum-subtitle">CATÁLOGO</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="blum-content">
        {visiblePhotos.length === 0 ? (
          <div className="blum-empty">
            <p className="blum-empty-icon">🌸</p>
            <p className="blum-empty-title">No hay productos aún</p>
            <p className="blum-empty-text">
              {user?.role === 'seller' ? 'Ve a Agregar para subir tu primer producto' : 'Aún no hay productos disponibles'}
            </p>
          </div>
        ) : (
          <div className="blum-grid">
            {visiblePhotos.map((photo, index) => (
              <IonCard key={index} className="blum-card">
                <IonImg src={photo.webviewPath} className="blum-card-img" />
                <IonCardHeader>
                  <IonCardTitle className="blum-card-title">{photo.nombre}</IonCardTitle>
                  <IonCardSubtitle>
                    <span className="blum-badge">${photo.precio}</span>
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className="blum-card-description">
                  {photo.descripcion}
                </IonCardContent>
                <div className="blum-card-actions">
                  {user?.role === 'client' && (
                    <>
                      <IonButton fill="clear" onClick={() => toggleFavorite(photo.filepath)}>
                        <IonIcon icon={favorites.includes(photo.filepath) ? heart : heartOutline} color="danger" />
                      </IonButton>
                      <IonButton fill="clear" color="primary"
                        onClick={() => { addToCart(photo); alert('Agregado al carrito 🛒'); }}>
                        <IonIcon icon={cartOutline} />
                      </IonButton>
                    </>
                  )}
                  {user?.role === 'seller' && (
                    <IonButton fill="clear" color="danger" onClick={() => setPhotoToDelete(photo)}>
                      <IonIcon icon={trash} />
                    </IonButton>
                  )}
                </div>
              </IonCard>
            ))}
          </div>
        )}

        <IonActionSheet
          isOpen={!!photoToDelete}
          header="¿Eliminar producto?"
          buttons={[
            {
              text: 'Eliminar',
              role: 'destructive',
              icon: trash,
              handler: () => {
                if (photoToDelete) {
                  deletePhoto(photoToDelete);
                  setPhotos(prev => prev.filter(p => p.filepath !== photoToDelete.filepath));
                  setPhotoToDelete(undefined);
                }
              }
            },
            { text: 'Cancelar', icon: close, role: 'cancel' }
          ]}
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;