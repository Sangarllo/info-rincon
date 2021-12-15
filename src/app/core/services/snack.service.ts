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

  // eslint-disable-next-line
  authError() {
    this.snackBar.open('¡Debes acceder como usuario registrado!', 'OK', {
      duration: 5000
    });

    // eslint-disable-next-line no-underscore-dangle
    return this.snackBar._openedSnackBarRef
      .onAction()
      .pipe(
        tap(_ =>
          this.router.navigate(['/login'])
        )
      )
      .subscribe();
  }

  adminError() {
    this.snackBar.open('¡Debes acceder como usuario administrador!', 'OK', {
      duration: 5000
    });

    // eslint-disable-next-line no-underscore-dangle
    return this.snackBar._openedSnackBarRef
      .onAction()
      .pipe(
        tap(_ =>
          this.router.navigate(['/login'])
        )
      )
      .subscribe();
  }
}
