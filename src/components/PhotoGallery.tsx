import React, { useState } from 'react';
import {
  IonButton, IonInput, IonTextarea,
  IonItem, IonLabel, IonIcon
} from '@ionic/react';
import { camera } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { UserPhoto } from '../hooks/usePhotoGallery';
import './PhotoGallery.css';

interface Props {
  addPhoto: (photo: UserPhoto) => void;
}

const PhotoGallery: React.FC<Props> = ({ addPhoto }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const handleAgregar = async () => {
    if (!nombre || !descripcion || !precio) {
      alert('Por favor completa todos los campos');
      return;
    }

    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const fileName = Date.now() + '.jpeg';
    let base64Data: string;

    if (isPlatform('hybrid')) {
      const file = await Filesystem.readFile({ path: photo.path! });
      base64Data = file.data as string;
    } else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    const newPhoto: UserPhoto = isPlatform('hybrid')
      ? { filepath: fileName, webviewPath: Capacitor.convertFileSrc(photo.path!), nombre, descripcion, precio }
      : { filepath: fileName, webviewPath: photo.webPath, nombre, descripcion, precio };

    addPhoto(newPhoto);
    setNombre('');
    setDescripcion('');
    setPrecio('');
  };

  return (
    <div className="form-wrapper">
      <div className="form-intro">
        <img src="/icon.png" className="intro-icon" alt="Blum" />
        <p className="intro-text">Agrega un nuevo producto a tu colección</p>
      </div>
      <div className="form-card">
        <IonItem lines="none">
          <IonLabel position="stacked" className="form-label">Nombre del producto</IonLabel>
          <IonInput value={nombre} onIonChange={e => setNombre(e.detail.value!)} placeholder="Ej: Sérum Vitamina C" />
        </IonItem>
        <IonItem lines="none">
          <IonLabel position="stacked" className="form-label">Descripción</IonLabel>
          <IonTextarea value={descripcion} onIonChange={e => setDescripcion(e.detail.value!)} placeholder="Describe tu producto..." rows={3} />
        </IonItem>
        <IonItem lines="none">
          <IonLabel position="stacked" className="form-label">Precio ($)</IonLabel>
          <IonInput type="number" value={precio} onIonChange={e => setPrecio(e.detail.value!)} placeholder="0.00" />
        </IonItem>
        <IonButton expand="block" className="form-btn" onClick={handleAgregar}>
          <IonIcon icon={camera} slot="start" />
          Agregar Foto
        </IonButton>
      </div>
    </div>
  );
};

export default PhotoGallery;