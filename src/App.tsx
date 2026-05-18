import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { triangle, ellipse } from 'ionicons/icons';

import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';

import { usePhotoGallery } from './hooks/usePhotoGallery';

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

const App: React.FC = () => {

  const {
    photos,
    addPhoto,
    deletePhoto
  } = usePhotoGallery();

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>

          <IonRouterOutlet>

            <Route exact path="/tab1">
              <Tab1
                photos={photos}
                removePhoto={deletePhoto}
              />
            </Route>

            <Route exact path="/tab2">
              <Tab2
                addPhoto={addPhoto}
              />
            </Route>

            <Route exact path="/">
              <Redirect to="/tab1" />
            </Route>

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

          </IonTabBar>

        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;