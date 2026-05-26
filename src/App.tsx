import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp, IonIcon, IonLabel, IonRouterOutlet,
  IonTabBar, IonTabButton, IonTabs, IonBadge, setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { triangle, ellipse, heart, cartOutline, receiptOutline, logOutOutline } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import { usePhotoGallery } from './hooks/usePhotoGallery';
import { useAuth } from './context/AuthContext';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

const ClientApp: React.FC<{ logout: () => void; cartCount: number }> = ({ logout, cartCount }) => (
  <IonTabs>
    <IonRouterOutlet animated={false}>
      <Route exact path="/tab1"><Tab1 /></Route>
      <Route exact path="/favorites"><Favorites /></Route>
      <Route exact path="/cart"><Cart /></Route>
      <Route exact path="/"><Redirect to="/tab1" /></Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="tab1" href="/tab1">
        <IonIcon icon={triangle} />
        <IonLabel>Catálogo</IonLabel>
      </IonTabButton>
      <IonTabButton tab="favorites" href="/favorites">
        <IonIcon icon={heart} />
        <IonLabel>Favoritos</IonLabel>
      </IonTabButton>
      <IonTabButton tab="cart" href="/cart">
        <IonIcon icon={cartOutline} />
        {cartCount > 0 && <IonBadge color="danger">{cartCount}</IonBadge>}
        <IonLabel>Carrito</IonLabel>
      </IonTabButton>
      <IonTabButton tab="logout" href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
        <IonIcon icon={logOutOutline} />
        <IonLabel>Salir</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const SellerApp: React.FC<{ logout: () => void }> = ({ logout }) => (
  <IonTabs>
    <IonRouterOutlet animated={false}>
      <Route exact path="/tab1"><Tab1 /></Route>
      <Route exact path="/tab2"><Tab2 /></Route>
      <Route exact path="/orders"><Orders /></Route>
      <Route exact path="/"><Redirect to="/tab1" /></Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="tab1" href="/tab1">
        <IonIcon icon={triangle} />
        <IonLabel>Catálogo</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab2" href="/tab2">
        <IonIcon icon={ellipse} />
        <IonLabel>Agregar</IonLabel>
      </IonTabButton>
      <IonTabButton tab="orders" href="/orders">
        <IonIcon icon={receiptOutline} />
        <IonLabel>Órdenes</IonLabel>
      </IonTabButton>
      <IonTabButton tab="logout" href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
        <IonIcon icon={logOutOutline} />
        <IonLabel>Salir</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const App: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const { cart } = usePhotoGallery();

  if (loading) return null;
  if (!user) return <Login />;

  return (
    <IonApp>
      <IonReactRouter>
        {user.role === 'client'
          ? <ClientApp logout={logout} cartCount={cart.length} />
          : <SellerApp logout={logout} />
        }
      </IonReactRouter>
    </IonApp>
  );
};

export default App;