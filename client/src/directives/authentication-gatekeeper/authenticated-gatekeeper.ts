import { Directive } from '@angular/core';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the AuthenticationGatekeeperDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[gated]' // Attribute selector
})
export class AuthenticatedGatekeeperDirective {

  constructor(navCtrl: NavController, httpService: HttpServiceProvider) {
    console.log(httpService.isLoggedIn());
    if (!httpService.isLoggedIn()) {
      navCtrl.setRoot("UserLoginPage");
    }
  }

}
