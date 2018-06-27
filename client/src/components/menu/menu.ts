import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';

/**
 * Generated class for the MenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'menu',
  templateUrl: 'menu.html',
})
export class MenuComponent {

  user: any;
  lang = localStorage.getItem("lang");
  strings = {
    MENU_PROFILE: "",
    MENU_SETTINGS: "",
    MENU_NOTIFICATIONS: "",
    MENU_LOGOUT: "",
    MENU_MENU: "",
    CTA_BUY: "",
    CTA_BUY_STATE: "",
    MENU_LANG: "",
    MENU_LANG_ENGLISH: "",
    MENU_LANG_FRENCH: "",
    OPT_CANCEL: ""
  };
  constructor(public viewCtrl: ViewController, public navParams: NavParams, private httpService: HttpServiceProvider) {
    this.user = this.navParams.data;
    this.user.currentSize = this.formatBytes(this.user.currentSize, 2);
    this.user.totalSize = this.formatBytes(this.user.totalSize, 2);
    this.getTranslate();
    httpService.translate.onLangChange.subscribe(lang => {
      this.getTranslate();
    });
  }

  getTranslate() {
    this.httpService.translate.get(Object.keys(this.strings), { current: this.user.currentSize, total: this.user.totalSize }).subscribe(res => {
      this.strings = res;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuComponent');
  }

  logout() {
    this.viewCtrl.dismiss({
      type: "logout"
    });
  }

  setLang() {
    localStorage.setItem("lang", this.lang);
    this.httpService.translate.use(this.lang);
    this.httpService.translate.setDefaultLang(this.lang);
    // window.location.reload();
  }

  formatBytes(a,b){if(0==a)return"0 KB";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

}
