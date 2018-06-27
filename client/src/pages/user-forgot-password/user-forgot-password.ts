import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the UserForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({selector: 'page-user-forgot-password', templateUrl: 'user-forgot-password.html'})
export class UserForgotPasswordPage {

  constructor(public navCtrl : NavController, public navParams : NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserForgotPasswordPage');
  }

  loginPage(){ this.navCtrl.push("UserLoginPage"); }
  signupPage(){ this.navCtrl.push("UserRegisterPage"); }

}
