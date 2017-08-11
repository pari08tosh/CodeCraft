import { Injectable } from '@angular/core';
@Injectable()
export class MainService {

  serverAddress: String = 'ServerAddress';

  constructor() { }

  getServerAddress() {
    return this.serverAddress;
  }

}
