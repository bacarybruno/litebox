import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import validator from 'validator';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { HomePage } from '../home/home';

/**
 * Generated class for the UserRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-register',
  templateUrl: 'user-register.html',
})
export class UserRegisterPage {

  userVm = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  user: {
    displayName: String,
    email: String,
    password: String,
    photoURL: String,
    providerId: "facebook.com" | "google.com" | "app"
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider, private httpService: HttpServiceProvider, public snackbar: ToastController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegisterPage');
  }

  private allVmFieldsHasValue() {
    Object.keys(this.userVm).forEach(key => {
      if (validator.isEmpty(this.userVm[key] || "")) return false;
    });
    return true;
  }

  register() {
    if (!this.allVmFieldsHasValue()) {
      this.createSnackbar("Validation failed: all fields must have a value");
    } else if (!validator.isEmail(this.userVm.email)) {
      this.createSnackbar("Validation failed: email not valid");
    } else if (this.userVm.password !== this.userVm.confirmPassword) {
      this.createSnackbar("Validation failed: password and confirmation are different");
    }  else {
      this.user = {
        email: this.userVm.email,
        password: this.userVm.password,
        displayName: this.userVm.displayName,
        photoURL: null,
        providerId: 'app'
      }
      this.httpRegister();
    }
  }
  
  private registerCallback(user) {
    if (!user) return;
    let userData = user.providerData[0];
    this.user = {
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      email: userData.email,
      password: userData.uid,
      providerId: userData.providerId === "google.com" ? "google.com" : "facebook.com"
    }
    this.httpRegister();
  }

  private httpRegister() {
    this.httpService.register(this.user).subscribe((res: any) => {
      if (res.success) {
        this.httpService.setAccessToken(res.data.token);
        this.logUserIn();
      } else {
        this.createSnackbar("ERR_USER_EXIST");
      }
    }, err => {
      this.createSnackbar("ERR_GENERIC");
    });
  }

  facebookRegister() {
    this.auth.signInWithFacebook().then(data => this.registerCallback(data.user)).catch(error => console.log(error));
  }

  googleRegister() {
    this.auth.signInWithGoogle().then(data => this.registerCallback(data.user)).catch(error => console.log(error));
  }

  loginPage(){ this.navCtrl.push("UserLoginPage"); }
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
