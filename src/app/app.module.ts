import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const config = {
  apiKey: "AIzaSyChFHMB9Kj4sEBdPKLRWu-JFVMg7gketuM",
  authDomain: "info-rincon.firebaseapp.com",
  projectId: "info-rincon",
  storageBucket: "info-rincon.appspot.com",
  measurementId: "G-46CK1QBGRK"
};

/*
messagingSenderId: "108949919658",
appId: "1:108949919658:web:f6b2983174d46837cafdd3",
*/

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
