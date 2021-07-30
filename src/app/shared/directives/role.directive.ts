import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { IUser } from '@models/user';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit {
  private currentUser: IUser;
  private permissions = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authSrv: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authSrv.user$.subscribe( (user: IUser) => {
      this.currentUser = user;
      this.updateView();
    });
  }

  @Input()
  set appRole(val: Array<string>) { // ['write']
    console.log(` ****`, val);
    this.permissions = val;
    this.updateView();
  }

  private updateView(): void {
    this.viewContainer.clear();
    if (this.checkPermission()) { //true , false
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private checkPermission(): boolean {
    let hasPermission = false;
    if (this.currentUser && this.currentUser.role) {
      for (const checkPermission of this.permissions) {
        const permissionFound = ( this.currentUser.role.toUpperCase() === checkPermission.toUpperCase() );

        if (permissionFound) {
          hasPermission = true;
          break;
        }
      }
    }
    return hasPermission;
  }
}
