import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';

import { HttpServiceProvider } from '../providers/http-service/http-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { FileHelpersModule } from 'ngx-file-helpers';
import { ComponentsModule } from '../components/components.module';
import { HomePage } from '../pages/home/home';
import { AppMaterialModule } from './material.menu';
import { DirectivesModule } from '../directives/directives.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const firebaseConfig = {
  fire: {
    apiKey: "AIzaSyDM6Po9SC15mThNy8TM_V-9SWpEe-8M6Nc",
    authDomain: "newagent-a92a4.firebaseapp.com",
    databaseURL: "https://newagent-a92a4.firebaseio.com",
    projectId: "newagent-a92a4",
    storageBucket: "newagent-a92a4.appspot.com",
    messagingSenderId: "776762261268"
  },
  fireNew: {
    apiKey: "AIzaSyBcpNiRUt6CgwRKC_H5ywFtaS28YyiYQjM",
    authDomain: "newagent-a92a4.firebaseapp.com",
    databaseURL: "https://newagent-a92a4.firebaseio.com",
    projectId: "newagent-a92a4",
    storageBucket: "newagent-a92a4.appspot.com",
    messagingSenderId: "776762261268"
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig.fireNew),
    AngularFireAuthModule,
    FileHelpersModule,
    ComponentsModule,
    DirectivesModule,
    AppMaterialModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen, {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    HttpServiceProvider,
    AngularFireAuth,
    AuthServiceProvider,
    SocialSharing
  ]
})
export class AppModule {}