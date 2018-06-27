import { Component } from '@angular/core';
import { HttpServiceProvider } from '../../providers/http-service/http-service';

/**
 * Generated class for the ItemCreateFileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-create-file',
  templateUrl: 'item-create-file.html'
})
export class ItemCreateFileComponent {

  strings = {
    NEW_FILE: "",
    CLICK_TO_CREATE: ""
  }

  constructor(private httpService: HttpServiceProvider) {
    console.log('Hello ItemCreateFileComponent Component');
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
