import { Injectable } from '@angular/core';
@Injectable()
export class MainService {

  serverAddress: String = 'localhost:3000';

  constructor() { }

  getServerAddress() {
    return this.serverAddress;
  }

}
