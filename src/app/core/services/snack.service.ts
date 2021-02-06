import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router) {
  }

  // tslint:disable-next-line: typedef
  authError() {
    this.snackBar.open('¡Debes acceder como usuario registrado!', 'OK', {
      duration: 5000
    });

    return this.snackBar._openedSnackBarRef
      .onAction()
      .pipe(
        tap(_ =>
          this.router.navigate(['/usuarios/login'])
        )
      )
      .subscribe();
  }
}
