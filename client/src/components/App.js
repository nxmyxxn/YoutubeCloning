import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import VideoUploadPage from './views/VideoUpoadPage/VideoUploadPage.js';
import VideoDetailPage from './views/VideoDetailPage/VideoDetailPage.js';
import SubscriptionPage from './views/SubscriptionPage/SubscriptionPage.js';

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)}/>
          <Route exact path="/video/:videoId" component={Auth(VideoDetailPage, null)}/>
          <Route exact path="/video/subscription" component={Auth(SubscriptionPage, null)}/>


        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
