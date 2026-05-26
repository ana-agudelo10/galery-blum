import React, { useState } from 'react';
import {
  IonContent, IonHeader, IonPage,
  IonToolbar, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonImg, IonActionSheet
} from '@ionic/react';
import { trash, close } from 'ionicons/icons';
import { UserPhoto } from '../hooks/usePhotoGallery';
import './Tab1.css';

interface Props {
  photos: UserPhoto[];
  removePhoto: (photo: UserPhoto) => void;
}

const Tab1: React.FC<Props> = ({ photos, removePhoto }) => {
  const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <div className="blum-header">
  <img src="/Logo.png" className="blum-logo-img" alt="Blum" />
  <span className="blum-subtitle">BEAUTY COLLECTION</span>
</div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="blum-content">
        {photos.length === 0 ? (
          <div className="blum-empty">
            <p className="blum-empty-icon"> <img src="/Logo.png" className="blum-logo-img" alt="Blum" /></p>
            <p className="blum-empty-title">No hay productos aún</p>
            <p className="blum-empty-text">Ve a Agregar para subir tu primer producto</p>
          </div>
        ) : (
          <div className="blum-padding">
            {photos.map((photo, index) => (
              <IonCard key={index} className="blum-card" onClick={() => setPhotoToDelete(photo)}>
                <IonImg src={photo.webviewPath} className="blum-card-img" />
                <IonCardHeader>
                  <IonCardTitle className="blum-card-title">{photo.nombre}</IonCardTitle>
                  <IonCardSubtitle>
                    <span className="blum-badge">${photo.precio}</span>
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className="blum-card-description">{photo.descripcion}</IonCardContent>
                <div className="blum-card-footer">Toca para eliminar</div>
              </IonCard>
            ))}
          </div>
        )}
        <IonActionSheet
          isOpen={!!photoToDelete}
          header="Opciones del producto"
          buttons={[
            {
              text: 'Eliminar producto',
              role: 'destructive',
              icon: trash,
              handler: () => {
                if (photoToDelete) {
                  removePhoto(photoToDelete);
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