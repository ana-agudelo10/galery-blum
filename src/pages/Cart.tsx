import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent,
  IonCard, IonImg, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonIcon, IonBadge
} from '@ionic/react';
import { trashOutline, cartOutline } from 'ionicons/icons';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart: React.FC = () => {
  const { cart, removeFromCart, checkout } = usePhotoGallery();
  const { user } = useAuth();
  const total = cart.reduce((sum, c) => sum + parseFloat(c.photo.precio) * c.cantidad, 0).toFixed(2);

  const handleCheckout = async () => {
    if (!user) return;
    if (cart.length === 0) { alert('Tu carrito está vacío'); return; }
    await checkout(user.email, user.name);
    alert('¡Compra realizada! El vendedor recibirá tu orden 🌸');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <div className="blum-header">
            <img src="/Logo.png" className="blum-logo-img" alt="Blum" />
            <span className="blum-subtitle">MI CARRITO</span>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="cart-content">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty-icon">🛒</p>
            <p className="cart-empty-text">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="cart-wrapper">
            {cart.map((item, i) => (
              <IonCard key={i} className="cart-card">
                <div className="cart-card-inner">
                  <IonImg src={item.photo.webviewPath} className="cart-img" />
                  <div className="cart-info">
                    <h3 className="cart-name">{item.photo.nombre}</h3>
                    <p className="cart-price">${item.photo.precio}</p>
                    <IonBadge color="primary">x{item.cantidad}</IonBadge>
                  </div>
                  <IonButton fill="clear" color="danger" onClick={() => removeFromCart(item.photo.filepath)}>
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </div>
              </IonCard>
            ))}
            <div className="cart-total">
              <span>Total:</span>
              <span className="cart-total-amount">${total}</span>
            </div>
            <IonButton expand="block" className="checkout-btn" onClick={handleCheckout}>
              <IonIcon icon={cartOutline} slot="start" />
              Confirmar Compra
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Cart;