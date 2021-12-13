import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
  ) { }

  gotoHome(): void {
    this.router.navigate(['/home']);
  }

  gotoAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
