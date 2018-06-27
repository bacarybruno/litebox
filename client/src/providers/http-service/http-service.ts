import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';

/*
  Generated class for the HttpServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpServiceProvider {

  public ROOT_URL : string = "http://localhost:3000";
  private TOKEN : string = "token";

  constructor(public http : HttpClient, public translate: TranslateService, plt: Platform) {
    plt.ready().then(() => {
      if (plt.is("cordova")) this.ROOT_URL = "https://5a94625f.ngrok.io";
    });
  }

  setAccessToken(token) {
    localStorage.setItem(this.TOKEN, token);
  }

  getAccessToken() {
    return localStorage.getItem(this.TOKEN);
  }

  isLoggedIn() {
    return !!this.getAccessToken();
  }

  private headers() {
    let headers = new HttpHeaders();
    return headers
      .append("Content-Type", "application/json")
      .append("Authorization", `Bearer ${this.getAccessToken()}`);
  }

  login(user : {
    email: String,
    password: String,
    providerId: "facebook.com" | "google.com" | "app"
  }) {
    return this
      .http
      .post(`${this.ROOT_URL}/api/unauthenticated/user/login`, user, {
        headers: this.headers()
      });
  }

  register(user : {
    displayName: String,
    email: String,
    password: String,
    photoURL: String,
    providerId: "facebook.com" | "google.com" | "app"
  }) {
    return this
      .http
      .post(`${this.ROOT_URL}/api/unauthenticated/user/register`, user, {
        headers: this.headers()
      });
  }

  getUserProfile() {
    return this
      .http
      .get(`${this.ROOT_URL}/api/authenticated/profile`, {
        headers: this.headers()
      });
  }

  getUserDocs(folderId) {
    return this
      .http
      .get(`${this.ROOT_URL}/api/authenticated/resources/${folderId}`, {
        headers: this.headers()
      });
  }

  sendFile(file, parentId, sourcePath) {
    const fileData = {
      parentId: parentId,
      name: file.name,
      size: file.size,
      type: file.type,
      content: file.content
    }
    return this
      .http
      .post(`${this.ROOT_URL}/api/authenticated/resources/file`, {
        file: fileData,
        sourcePath: sourcePath
      }, {
        headers: this.headers()
      });
  }

  createFolder(name, parentId, sourcePath) {
    return this
      .http
      .post(`${this.ROOT_URL}/api/authenticated/resources/folder`, {
        name, parentId, sourcePath
      }, {
        headers: this.headers()
      });
  }

  renameFile(fileId, name, sourcePath) {
    return this
      .http
      .put(`${this.ROOT_URL}/api/authenticated/resources/file/${fileId}`, {
        name, sourcePath
      }, {
        headers: this.headers()
      });
  }

  renameFolder(folderId, name, sourcePath) {
    return this
      .http
      .put(`${this.ROOT_URL}/api/authenticated/resources/folder/${folderId}`, {
        name, sourcePath
      }, {
        headers: this.headers()
      });
  }

  moveFile(payload) {
    return this
      .http
      .put(`${this.ROOT_URL}/api/authenticated/resources/file/${payload.value}`, {
        sourcePath: payload.sourcePath,
        destPath: payload.destPath,
        parentId: payload.parentId
      }, {
        headers: this.headers()
      });
  }

  moveFolder(payload) {
    return this
      .http
      .put(`${this.ROOT_URL}/api/authenticated/resources/folder/${payload.value}`, {
        sourcePath: payload.sourcePath,
        destPath: payload.destPath,
        parentId: payload.parentId
      }, {
        headers: this.headers()
      });
  }

  shareElement(data) {
    return this
      .http
      .post(`${this.ROOT_URL}/api/share/`, {
        owner: data.owner,
        elementId: data._id,
        type: data.type ? "file" : "folder"
      }, {
        headers: this.headers()
      });
  }

  downloadFile(fileId) {
    const url = `${this.ROOT_URL}/api/authenticated/resources/file/${fileId}/download`;
    return this.http.get(url, { 
      headers: this.headers(),
      responseType: "blob"
    });  
  }

  downloadFolder(folderId) {
    const url = `${this.ROOT_URL}/api/authenticated/resources/folder/${folderId}/download`;
    return this.http.get(url, { 
      headers: this.headers(),
      responseType: "blob"
    });
  }

  deleteFolder(folderId) {
    return this
      .http
      .delete(`${this.ROOT_URL}/api/authenticated/resources/folder/${folderId}`, {
        headers: this.headers()
      });
  }

  deleteFile(fileId) : any {
    return this
      .http
      .delete(`${this.ROOT_URL}/api/authenticated/resources/file/${fileId}`, {
        headers: this.headers()
      });
  }

  openFile(fileId) {
    window.open(`${this.ROOT_URL}/api/authenticated/resources/file/${fileId}/view`, "_system");
  }

}
