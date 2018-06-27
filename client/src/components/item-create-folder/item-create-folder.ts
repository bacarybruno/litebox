import { Component } from '@angular/core';
import { HttpServiceProvider } from '../../providers/http-service/http-service';

/**
 * Generated class for the ItemCreateFolderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-create-folder',
  templateUrl: 'item-create-folder.html'
})
export class ItemCreateFolderComponent {

  strings = {
    NEW_FOLDER: "",
    CLICK_TO_CREATE: ""
  }

  constructor(private httpService: HttpServiceProvider) {
    console.log('Hello ItemCreateFolderComponent Component');
    this.getTranslate();
    httpService.translate.onLangChange.subscribe(lang => {
      this.getTranslate();
    });
  }

  getTranslate() {
    this.httpService.translate.get(Object.keys(this.strings)).subscribe(res => {
      this.strings = res;
    });
  }

}
