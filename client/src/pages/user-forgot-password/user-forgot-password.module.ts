import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserForgotPasswordPage } from './user-forgot-password';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    UserForgotPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(UserForgotPasswordPage),
    DirectivesModule
  ],
})
export class UserForgotPasswordPageModule {}
