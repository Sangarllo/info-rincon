import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { LoginPageComponent } from '@app/users/login-page/login-page.component';
import { GoogleSigninDirective } from '@app/users/google-signin.directive';
import { EmailLoginComponent } from '@app/users/email-login/email-login.component';
import { UsersRoutingModule } from '@app/users/users-routing.module';
import { UsersComponent } from '@app/users/users.component';
import { UserViewComponent } from '@app/users/user-view/user-view.component';
import { UserEditComponent } from '@app/users/user-edit/user-edit.component';
import { UserEntitiesComponent } from '@app/users/user-entities/user-entities.component';
import { UserAdminEntitiesComponent } from '@app/users/user-admin-entities/user-admin-entities.component';
import { UserAuditComponent } from './user-audit/user-audit.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    GoogleSigninDirective,
    EmailLoginComponent,
    UsersComponent,
    UserViewComponent,
    UserEditComponent,
    UserEntitiesComponent,
    UserAdminEntitiesComponent,
    UserAuditComponent,
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
