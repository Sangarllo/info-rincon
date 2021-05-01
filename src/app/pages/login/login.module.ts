import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { GoogleSigninDirective } from '@pages/login/google-signin.directive';
import { EmailLoginComponent } from '@pages/login/email-login/email-login.component';
import { LoginRoutingModule } from '@pages/login/login-routing.module';
import { LoginComponent } from '@pages/login/login.component';

@NgModule({
  declarations: [
    GoogleSigninDirective,
    EmailLoginComponent,
    LoginComponent
  ],
  imports: [
    SharedModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
