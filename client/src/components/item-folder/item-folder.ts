import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ActionSheetController, AlertController} from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import * as moment from 'moment';
import { saveFile } from '../../helpers/file-download';

/**
 * Generated class for the ItemFolderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({selector: 'item-folder', templateUrl: 'item-folder.html'})
export class ItemFolderComponent implements OnInit {

  @Input() data: any;
  @Output() onNavigate: EventEmitter<String> = new EventEmitter();
  @Output() onRename: EventEmitter<{id: String, value: String}> = new EventEmitter();
  @Output() onDelete: EventEmitter<String> = new EventEmitter();
  @Output() onMove: EventEmitter<String> = new EventEmitter();
  @Output() onShare: EventEmitter<String> = new EventEmitter();
  @Output() onStartDownload: EventEmitter<String> = new EventEmitter();
  @Output() onEndDownload: EventEmitter<String> = new EventEmitter();
  
  readableSize: String;
  readableDate: String;

  constructor(private actionSheetCtrl : ActionSheetController, private alertCtrl : AlertController, private httpService: HttpServiceProvider) {
    console.log('Hello ItemFolderComponent Component');
  }

  ngOnInit(): void {
    this.readableSize = this.formatBytes(this.data.size, 2);
    this.readableDate = moment(this.data.updatedAt).fromNow();
  }

  downloadFolder() {
    this.onStartDownload.emit();
    return this.httpService.downloadFolder(this.data._id).subscribe((res: any) => {
      this.onEndDownload.emit();
      saveFile(res, this.data.name + ".zip");
    });
  }

  moveFolder() {
    this.onMove.emit(this.data._id);
  }

  shareFolder() {
    this.httpService.shareElement(this.data).subscribe((res: any) => {
      if (res.success) {
        this.onShare.emit(res.data.path);
      }
    });
  }

  confirmDeleteFolder() {
      this.httpService.translate.get(["ARE_YOU_SURE", "OPT_CANCEL", "OPT_CONFIRM", "INFO_FOLDER_WILL_BE_DELETED"]).subscribe(res => {
      let confirm = this
        .alertCtrl
        .create({
          title: res.ARE_YOU_SURE,
          message: res.INFO_FOLDER_WILL_BE_DELETED,
          buttons: [
            {
              text: res.OPT_CANCEL,
              role: 'cancel'
            }, {
              text: res.OPT_CONFIRM,
              handler: () => {
                this.httpService.deleteFolder(this.data._id).subscribe(
                  (res: any) => { if (res.success) this.onDelete.emit(this.data._id) }
                )
              }
            }
          ]
        });
      confirm.present();
    });
  }

  renameFolder() {
    this.httpService.translate.get(["INFO_RENAME_FOLDER", "OPT_CANCEL", "OPT_CONFIRM"]).subscribe(res => {
      let prompt = this
        .alertCtrl
        .create({
          title: res.INFO_RENAME_FILE,
          inputs: [
            {
              name: 'value',
              value: this.data.name
            }
          ],
          buttons: [
            {
              text: res.OPT_CANCEL
            }, {
              text: res.OPT_CONFIRM,
              handler: data => {
                this.onRename.emit({id: this.data._id, value: data.value});
              }
            }
          ]
        });
      prompt.present();
    });
  }

  openOptions($event) {
    $event.preventDefault();
    this.httpService.translate.get(["OPT_OPTIONS", "OPT_RENAME", "OPT_MOVE", "OPT_SHARE", "OPT_DOWNLOAD", "OPT_DELETE", "OPT_CANCEL"]).subscribe(res => {
      let actionSheet = this
        .actionSheetCtrl
        .create({
          title: res.OPT_OPTIONS,
          buttons: [
            {
              text: res.OPT_RENAME,
              handler: this.renameFolder.bind(this)
            }, {
              text: res.OPT_MOVE,
              handler: this.moveFolder.bind(this)
            }, {
              text: res.OPT_SHARE,
              handler: this.shareFolder.bind(this)
            }, {
              text: res.OPT_DOWNLOAD,
              handler: this.downloadFolder.bind(this)
            }, {
              text: res.OPT_DELETE,
              role: 'destructive',
              handler: this.confirmDeleteFolder.bind(this)
            }, {
              text: res.OPT_CANCEL,
              role: 'cancel'
            }
          ]
        });
      actionSheet.present();
    });
  }

  openFolder() {
    // console.log("Navigating to " + this.data._id);
    this.onNavigate.emit(this.data);
  }

  formatBytes(a,b){if(0==a)return"Empty";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

}
