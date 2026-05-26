import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent,
  IonCard, IonImg, IonCardHeader, IonCardTitle,
  IonCardContent, IonBadge, IonButton
} from '@ionic/react';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import { useIonViewWillEnter } from '@ionic/react';
import './Orders.css';

const Orders: React.FC = () => {
  const { orders, updateOrderStatus, reloadOrders } = usePhotoGallery();

  useIonViewWillEnter(() => {
    reloadOrders();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <div className="blum-header">
            <img src="/Logo.png" className="blum-logo-img" alt="Blum" />
            <span className="blum-subtitle">ÓRDENES RECIBIDAS</span>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="orders-content">
        {orders.length === 0 ? (
          <div className="orders-empty">
            <p className="orders-empty-icon">📦</p>
            <p className="orders-empty-text">No hay órdenes aún</p>
          </div>
        ) : (
          <div className="orders-wrapper">
            {orders.map((order, i) => (
              <IonCard key={i} className="order-card">
                <IonCardHeader>
                  <div className="order-header-row">
                    <IonCardTitle className="order-title">Orden #{order.id.slice(-4)}</IonCardTitle>
                    <IonBadge color={order.status === 'pendiente' ? 'warning' : 'success'}>
                      {order.status === 'pendiente' ? ' Pendiente' : ' Enviado'}
                    </IonBadge>
                  </div>
                  <p className="order-client"> {order.clientName}</p>
                  <p className="order-date"> {order.date}</p>
                </IonCardHeader>
                <IonCardContent>
                  {order.items.map((item, j) => (
                    <div key={j} className="order-item">
                      <IonImg src={item.photo.webviewPath} className="order-item-img" />
                      <div className="order-item-info">
                        <p className="order-item-name">{item.photo.nombre}</p>
                        <p className="order-item-qty">x{item.cantidad} — ${item.photo.precio}</p>
                      </div>
                    </div>
                  ))}
                  <div className="order-total">Total: <strong>${order.total}</strong></div>
                  {order.status === 'pendiente' && (
                    <IonButton expand="block" className="order-btn"
                      onClick={() => updateOrderStatus(order.id, 'enviado')}>
                      Marcar como Enviado 
                    </IonButton>
                  )}
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Orders;