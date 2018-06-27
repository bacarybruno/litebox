import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;

declare var googleyolo: any;
declare var window: any;

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

	constructor(public afAuth: AngularFireAuth) {}

	setupYolo() {
		window.onGoogleYoloLoad = this.yoloInit.bind(this);
	}

	signInWithEmail(credentials) {
		console.log('Sign in with email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
	}

	signUp(credentials) {
		return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
	}

	signOut(): Promise<void> {
		localStorage.clear();
    	sessionStorage.clear();
		return this.afAuth.auth.signOut();
	}

	signInWithGoogle() {
		console.log('Sign in with google');
		return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  	}
  
  	signInWithFacebook() {
		console.log('Sign in with facebook');
		return this.oauthSignIn(new firebase.auth.FacebookAuthProvider());
	}

	private oauthSignIn(provider: AuthProvider) {
		if (!window.cordova) return this.afAuth.auth.signInWithPopup(provider);
		return new Promise<any>((resolve, reject) => {
			this.afAuth.auth.signInWithRedirect(provider)
			.then(() => {
				this.afAuth.auth.getRedirectResult().then(resolve).catch(reject);
			});
		});
	}  

	yoloInit() {
		const hintPromise = googleyolo.hint({
			supportedAuthMethods: [
				"googleyolo://id-and-password",
				"https://accounts.google.com"
			],
			supportedIdTokenProviders: [
				{
					uri: "https://accounts.google.com",
					clientId: "776762261268-vtsivhpqrtclnnbr3i3pu3mq3iqugdqj.apps.googleusercontent.com"
				}
			]
	   	});
		hintPromise.then(credentials => {
			console.log(credentials);
			if (credentials.idToken) {
				this.afAuth.auth.signInAndRetrieveDataWithCredential(firebase.auth.GoogleAuthProvider.credential(credentials.idToken));
			} else {

			}
		}, console.log);
	}

}
