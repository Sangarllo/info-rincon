import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { LoginPageComponent } from '@features/users/login-page/login-page.component';
import { GoogleSigninDirective } from '@features/users/google-signin.directive';
import { EmailLoginComponent } from '@features/users/email-login/email-login.component';
import { UsersRoutingModule } from '@features/users/users-routing.module';
import { UsersComponent } from '@features/users/users.component';
import { UserViewComponent } from '@features/users/user-view/user-view.component';
import { UserEditComponent } from '@features/users/user-edit/user-edit.component';
import { UserAdminEntitiesComponent } from '@features/users/user-admin-entities/user-admin-entities.component';
import { UserAuditComponent } from './user-audit/user-audit.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    GoogleSigninDirective,
    EmailLoginComponent,
    UsersComponent,
    UserViewComponent,
    UserEditComponent,
    UserAdminEntitiesComponent,
    UserAuditComponent,
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
