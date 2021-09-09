import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Socket } from 'ngx-socket-io';
import { GlobaldataService } from './providers/globaldata.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private socket: Socket,
    private nativeStorage: NativeStorage,
    private router:Router
  ) {
    console.log('app')
    this.socket.connect();
    console.log(this.nativeStorage.getItem('currentUser'))
    this.nativeStorage.getItem('currentUser')
  .then(
    data => (GlobaldataService.userName.next(data.user[0].name),this.router.navigate(['./users'])),
    error => (console.log(error),this.router.navigate(['./home']) )
  );
  }

  
}
