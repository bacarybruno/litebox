import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = "UserLoginPage";
  // rootPage: any = "UserRegisterPage";  
  rootPage: any = HomePage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, translate: TranslateService) {
    this.initializeApp();
    // if (!localStorage.getItem("lang")) localStorage.setItem("lang", "en");
    let acceptedLangs = ["fr", "en"].join();
    let browserLang = translate.getBrowserLang();
    let lang = localStorage.getItem("lang") || acceptedLangs.includes(browserLang) ? browserLang : "en";
    translate.setDefaultLang(lang);
    translate.use(lang);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString("#0E46A0");
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();
    });
  }
  
}
