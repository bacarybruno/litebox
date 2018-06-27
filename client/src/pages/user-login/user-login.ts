import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import validator from 'validator';
import { HomePage } from '../home/home';

/**
 * Generated class for the UserLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-login',
  templateUrl: 'user-login.html',
})
export class UserLoginPage {

  userVm = {
    email: null,
    password: null
  }

  user: {
    email: String,
    password: String,
    providerId: "facebook.com" | "google.com" | "app"
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider, private httpService: HttpServiceProvider, public snackbar: ToastController) {
    auth.afAuth.authState.subscribe(user => this.loginCallback);
    // auth.yoloInit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserLoginPage');
  }

  private allVmFieldsHasValue() {
    Object.keys(this.userVm).forEach(key => {
      if (validator.isEmpty(this.userVm[key] || "")) return false;
    });
    return true;
  }

  login() {
    if (!this.allVmFieldsHasValue()) {
      this.createSnackbar("ERR_FIELDS_REQUIRED");
    } else if (!validator.isEmail(this.userVm.email)) {
      this.createSnackbar("ERR_EMAIL_INVALID");
    } else {
      this.user = {
        email: this.userVm.email,
        password: this.userVm.password,
        providerId: "app"
      }
      this.httpLogin();
    }
  }

  private loginCallback(user) {
    if (!user) return;
    let userData = user.providerData[0];
    this.user = {
      email: userData.email,
      password: userData.uid,
      providerId: userData.providerId === "google.com" ? "google.com" : "facebook.com"
    }
    this.httpLogin();
  }

  private httpLogin() {
    this.httpService.login(this.user).subscribe((res: any) => {
      if (res.success) {
        this.httpService.setAccessToken(res.data.token);
        this.logUserIn();
      } else {
        this.createSnackbar("ERR_NO_USER_EXIST");
      }
    }, err => {
      this.createSnackbar("ERR_GENERIC");
    });
  }
  
  facebookLogin() {
    this.auth.signInWithFacebook().then(data => this.loginCallback(data.user)).catch(error => console.log(error));
  }

  googleLogin() {
    this.auth.signInWithGoogle().then(data => this.loginCallback(data.user)).catch(error => console.log(error));
  }

  signupPage(){ this.navCtrl.push("UserRegisterPage"); }
  forgotPasswordPage(){ this.navCtrl.push("UserForgotPasswordPage"); }
  logUserIn(){ this.navCtrl.setRoot(HomePage); }

  createSnackbar(message, action?) {
    this.httpService.translate.get([message, "DISMISS"]).subscribe(res => {
      this.snackbar.create({ 
        message: res[message], 
        closeButtonText: res["DISMISS"].toUpperCase(), 
        showCloseButton: true,
        duration: 3000
      }).present();
    });
  }

}
