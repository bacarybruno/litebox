import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ActionSheetController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { saveFile } from '../../helpers/file-download';

/**
 * Generated class for the ItemFileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-file',
  templateUrl: 'item-file.html'
})
export class ItemFileComponent implements OnInit {

  @Input() data: any;
  @Output() onDelete: EventEmitter<String> = new EventEmitter();
  @Output() onRename: EventEmitter<{id: String, value: String, extension: String}> = new EventEmitter();
  @Output() onShare: EventEmitter<String> = new EventEmitter();
  @Output() onMove: EventEmitter<String> = new EventEmitter();
  @Output() onStartDownload: EventEmitter<String> = new EventEmitter();
  @Output() onEndDownload: EventEmitter<String> = new EventEmitter();

  icon: String;
  preview: String;
  readableSize: String;
  readableDate: String;

  constructor(private actionSheetCtrl : ActionSheetController, private alertCtrl : AlertController, private httpService: HttpServiceProvider) {
    console.log('Hello ItemFileComponent Component');
  }

  ngOnInit(): void {
    if (!this.data) return;
    this.icon = `assets/imgs/filetypes/${this.getIconName(this.data.name)}.svg`;
    this.preview = `${this.httpService.ROOT_URL}/previews/${this.data._id}.png`;
    this.readableSize = this.formatBytes(this.data.size, 2);
    this.readableDate = moment(this.data.updatedAt).fromNow();
  }

  downloadFile() {
    this.onStartDownload.emit();
    return this.httpService.downloadFile(this.data._id).subscribe((res: any) => {
      this.onEndDownload.emit();
      saveFile(res, this.data.name);
    });
  }

  shareFile() {
    this.httpService.shareElement(this.data).subscribe((res: any) => {
      if (res.success) {
        this.onShare.emit(res.data.path);
      }
    });
  }

  extension() {
    let splited = this.data.name.split('.');
    let extension = splited[splited.length - 1];
    return extension;
  }

	getIconName(filename) {
    let extension = this.extension();
    let mappings = MIMETYPES.mappings[extension];
    let mimeType = mappings && mappings[0] || '';
    let alias = MIMETYPES.aliases[mimeType] ? MIMETYPES.aliases[mimeType].replace(new RegExp('/', 'g'), '-') : null;
    let aliasIcon = alias ? alias.replace(new RegExp('/', 'g'), '-') : null;
    let icon = mimeType.replace(new RegExp('/', 'g'), '-');
		if (mimeType === 'dir' && MIMETYPES.files.indexOf('folder') !== -1) {
			return 'folder';
		} if (mimeType === 'dir-shared' && MIMETYPES.files.indexOf('folder-shared') !== -1) {
			return 'folder-shared';
		} if (mimeType === 'dir-public' && MIMETYPES.files.indexOf('folder-public') !== -1) {
			return 'folder-public';
		} if (mimeType === 'dir-external' && MIMETYPES.files.indexOf('folder-external') !== -1) {
			return 'folder-external';
		} if (aliasIcon) {
			return aliasIcon;
		} if (MIMETYPES.files.indexOf(icon) !== -1) {
			return icon;
		} if (MIMETYPES.files.indexOf(icon.split('-')[0]) !== -1) {
			return icon.split('-')[0];
		} if (MIMETYPES.files.indexOf('file') !== -1) {
			return 'file';
		}
		return 'package-x-generic';
	}  

  confirmDeleteFile() {
    this.httpService.translate.get(["ARE_YOU_SURE", "OPT_CANCEL", "OPT_CONFIRM", "INFO_FILE_WILL_BE_DELETED"]).subscribe(res => {
      let confirm = this
        .alertCtrl
        .create({
          title: res.ARE_YOU_SURE,
          message: res.INFO_FILE_WILL_BE_DELETED,
          buttons: [
            {
              text: res.OPT_CANCEL,
              role: 'cancel'
            }, {
              text: res.OPT_CONFIRM,
              handler: () => {
                this.httpService.deleteFile(this.data._id).subscribe(
                  (res: any) => { if (res.success) this.onDelete.emit(this.data._id) }
                )
              }
            }
          ]
        });
      confirm.present();
    });
  }

  renameFile() {
    let name = this.data.name.split('.');
    let ext = name[name.length - 1];
    name = name.filter(n => n !== ext).join('');
    this.httpService.translate.get(["INFO_RENAME_FILE", "OPT_CANCEL", "OPT_CONFIRM"]).subscribe(res => {
      let prompt = this
        .alertCtrl
        .create({
          title: res.INFO_RENAME_FILE,
          inputs: [
            {
              name: 'value',
              value: name
            }
          ],
          buttons: [
            {
              text: res.OPT_CANCEL
            }, {
              text: res.OPT_CONFIRM,
              handler: data => {
                this.onRename.emit({id: this.data._id, value: data.value, extension: this.extension()});
              }
            }
          ]
        });
      prompt.present();
    });
  }

  moveFile() {
    this.onMove.emit(this.data._id);
  }

  formatBytes(a,b){if(0==a)return"Empty";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

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
              handler: this.renameFile.bind(this)
            }, {
              text: res.OPT_MOVE,
              handler: this.moveFile.bind(this)
            }, {
              text: res.OPT_SHARE,
              handler: this.shareFile.bind(this)
            }, {
              text: res.OPT_DOWNLOAD,
              handler: this.downloadFile.bind(this)
            }, {
              text: res.OPT_DELETE,
              role: 'destructive',
              handler: this.confirmDeleteFile.bind(this)
            }, {
              text: res.OPT_CANCEL,
              role: 'cancel'
            }
          ]
        });
      actionSheet.present();
    });
  }

  openFile() {
    this.httpService.openFile(this.data._id);
  }
}


const MIMETYPES = {
  "aliases": {
      "application/coreldraw": "image",
      "application/epub+zip": "text",
      "application/font-sfnt": "image",
      "application/font-woff": "image",
      "application/illustrator": "image",
      "application/javascript": "text/code",
      "application/json": "text/code",
      "application/msaccess": "file",
      "application/msexcel": "x-office/spreadsheet",
      "application/msonenote": "x-office/document",
      "application/mspowerpoint": "x-office/presentation",
      "application/msword": "x-office/document",
      "application/octet-stream": "file",
      "application/postscript": "image",
      "application/rss+xml": "application/xml",
      "application/vnd.android.package-archive": "package/x-generic",
      "application/vnd.lotus-wordpro": "x-office/document",
      "application/vnd.ms-excel": "x-office/spreadsheet",
      "application/vnd.ms-excel.addin.macroEnabled.12": "x-office/spreadsheet",
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12": "x-office/spreadsheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12": "x-office/spreadsheet",
      "application/vnd.ms-excel.template.macroEnabled.12": "x-office/spreadsheet",
      "application/vnd.ms-fontobject": "image",
      "application/vnd.ms-powerpoint": "x-office/presentation",
      "application/vnd.ms-powerpoint.addin.macroEnabled.12": "x-office/presentation",
      "application/vnd.ms-powerpoint.presentation.macroEnabled.12": "x-office/presentation",
      "application/vnd.ms-powerpoint.slideshow.macroEnabled.12": "x-office/presentation",
      "application/vnd.ms-powerpoint.template.macroEnabled.12": "x-office/presentation",
      "application/vnd.ms-word.document.macroEnabled.12": "x-office/document",
      "application/vnd.ms-word.template.macroEnabled.12": "x-office/document",
      "application/vnd.oasis.opendocument.presentation": "x-office/presentation",
      "application/vnd.oasis.opendocument.presentation-template": "x-office/presentation",
      "application/vnd.oasis.opendocument.spreadsheet": "x-office/spreadsheet",
      "application/vnd.oasis.opendocument.spreadsheet-template": "x-office/spreadsheet",
      "application/vnd.oasis.opendocument.text": "x-office/document",
      "application/vnd.oasis.opendocument.text-master": "x-office/document",
      "application/vnd.oasis.opendocument.text-template": "x-office/document",
      "application/vnd.oasis.opendocument.text-web": "x-office/document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "x-office/presentation",
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "x-office/presentation",
      "application/vnd.openxmlformats-officedocument.presentationml.template": "x-office/presentation",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "x-office/spreadsheet",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": "x-office/spreadsheet",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "x-office/document",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": "x-office/document",
      "application/vnd.visio": "x-office/document",
      "application/vnd.wordperfect": "x-office/document",
      "application/x-7z-compressed": "package/x-generic",
      "application/x-bzip2": "package/x-generic",
      "application/x-cbr": "text",
      "application/x-compressed": "package/x-generic",
      "application/x-dcraw": "image",
      "application/x-deb": "package/x-generic",
      "application/x-font": "image",
      "application/x-gimp": "image",
      "application/x-gzip": "package/x-generic",
      "application/x-perl": "text/code",
      "application/x-photoshop": "image",
      "application/x-php": "text/code",
      "application/x-rar-compressed": "package/x-generic",
      "application/x-tar": "package/x-generic",
      "application/x-tex": "text",
      "application/xml": "text/html",
      "application/yaml": "text/code",
      "application/zip": "package/x-generic",
      "database": "file",
      "httpd/unix-directory": "dir",
      "message/rfc822": "text",
      "text/css": "text/code",
      "text/csv": "x-office/spreadsheet",
      "text/html": "text/code",
      "text/x-c": "text/code",
      "text/x-c++src": "text/code",
      "text/x-h": "text/code",
      "text/x-java-source": "text/code",
      "text/x-python": "text/code",
      "text/x-shellscript": "text/code",
      "web": "text/code"
  },
  "files": [
      "application",
      "application-pdf",
      "audio",
      "file",
      "folder",
      "folder-drag-accept",
      "folder-external",
      "folder-public",
      "folder-shared",
      "folder-starred",
      "image",
      "package-x-generic",
      "text",
      "text-calendar",
      "text-code",
      "text-vcard",
      "video",
      "x-office-document",
      "x-office-presentation",
      "x-office-spreadsheet"
  ],
  mappings: {
      "3gp": ["video/3gpp"],
      "7z": ["application/x-7z-compressed"],
      "accdb": ["application/msaccess"],
      "ai": ["application/illustrator"],
      "apk": ["application/vnd.android.package-archive"],
      "arw": ["image/x-dcraw"],
      "avi": ["video/x-msvideo"],
      "bash": ["text/x-shellscript"],
      "blend": ["application/x-blender"],
      "bin": ["application/x-bin"],
      "bmp": ["image/bmp"],
      "bpg": ["image/bpg"],
      "bz2": ["application/x-bzip2"],
      "cb7": ["application/x-cbr"],
      "cba": ["application/x-cbr"],
      "cbr": ["application/x-cbr"],
      "cbt": ["application/x-cbr"],
      "cbtc": ["application/x-cbr"],
      "cbz": ["application/x-cbr"],
      "cc": ["text/x-c"],
      "cdr": ["application/coreldraw"],
      "class": ["application/java"],
      "cnf": ["text/plain"],
      "conf": ["text/plain"],
      "cpp": ["text/x-c++src"],
      "cr2": ["image/x-dcraw"],
      "css": ["text/css"],
      "csv": ["text/csv"],
      "cvbdl": ["application/x-cbr"],
      "c": ["text/x-c"],
      "c++": ["text/x-c++src"],
      "dcr": ["image/x-dcraw"],
      "deb": ["application/x-deb"],
      "dng": ["image/x-dcraw"],
      "doc": ["application/msword"],
      "docm": ["application/vnd.ms-word.document.macroEnabled.12"],
      "docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "dot": ["application/msword"],
      "dotx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.template"],
      "dv": ["video/dv"],
      "eml": ["message/rfc822"],
      "eot": ["application/vnd.ms-fontobject"],
      "epub": ["application/epub+zip"],
      "eps": ["application/postscript"],
      "erf": ["image/x-dcraw"],
      "exe": ["application/x-ms-dos-executable"],
      "flac": ["audio/flac"],
      "flv": ["video/x-flv"],
      "gif": ["image/gif"],
      "gz": ["application/x-gzip"],
      "gzip": ["application/x-gzip"],
      "h": ["text/x-h"],
      "heic": ["image/heic"],
      "heif": ["image/heif"],
      "hh": ["text/x-h"],
      "hpp": ["text/x-h"],
      "html": ["text/html", "text/plain"],
      "htm": ["text/html", "text/plain"],
      "ical": ["text/calendar"],
      "ics": ["text/calendar"],
      "iiq": ["image/x-dcraw"],
      "impress": ["text/impress"],
      "java": ["text/x-java-source"],
      "jpeg": ["image/jpeg"],
      "jpg": ["image/jpeg"],
      "jps": ["image/jpeg"],
      "js": ["application/javascript", "text/plain"],
      "json": ["application/json", "text/plain"],
      "k25": ["image/x-dcraw"],
      "kdc": ["image/x-dcraw"],
      "key": ["application/x-iwork-keynote-sffkey"],
      "keynote": ["application/x-iwork-keynote-sffkey"],
      "kra": ["application/x-krita"],
      "lwp": ["application/vnd.lotus-wordpro"],
      "m2t": ["video/mp2t"],
      "m4a": ["audio/mp4"],
      "m4b": ["audio/m4b"],
      "m4v": ["video/mp4"],
      "markdown": ["text/markdown"],
      "mdown": ["text/markdown"],
      "md": ["text/markdown"],
      "mdb": ["application/msaccess"],
      "mdwn": ["text/markdown"],
      "mkd": ["text/markdown"],
      "mef": ["image/x-dcraw"],
      "mkv": ["video/x-matroska"],
      "mobi": ["application/x-mobipocket-ebook"],
      "mov": ["video/quicktime"],
      "mp3": ["audio/mpeg"],
      "m3u": ["audio/mpegurl"],
      "m3u8": ["audio/mpegurl"],	
      "mp4": ["video/mp4"],
      "mpeg": ["video/mpeg"],
      "mpg": ["video/mpeg"],
      "mpo": ["image/jpeg"],
      "msi": ["application/x-msi"],
      "mts": ["video/MP2T"],
      "mt2s": ["video/MP2T"],
      "nef": ["image/x-dcraw"],
      "numbers": ["application/x-iwork-numbers-sffnumbers"],
      "odf": ["application/vnd.oasis.opendocument.formula"],
      "odg": ["application/vnd.oasis.opendocument.graphics"],
      "odp": ["application/vnd.oasis.opendocument.presentation"],
      "ods": ["application/vnd.oasis.opendocument.spreadsheet"],
      "odt": ["application/vnd.oasis.opendocument.text"],
      "oga": ["audio/ogg"],
      "ogg": ["audio/ogg"],
      "ogv": ["video/ogg"],
      "one": ["application/msonenote"],
      "opus": ["audio/ogg"],	
      "orf": ["image/x-dcraw"],
      "otf": ["application/font-sfnt"],
      "pages": ["application/x-iwork-pages-sffpages"],
      "pdf": ["application/pdf"],
      "pfb": ["application/x-font"],
      "pef": ["image/x-dcraw"],
      "php": ["application/x-php"],
      "pl": ["application/x-perl"],
      "pls": ["audio/x-scpls"],
      "png": ["image/png"],
      "pot": ["application/vnd.ms-powerpoint"],
      "potm": ["application/vnd.ms-powerpoint.template.macroEnabled.12"],
      "potx": ["application/vnd.openxmlformats-officedocument.presentationml.template"],
      "ppa": ["application/vnd.ms-powerpoint"],
      "ppam": ["application/vnd.ms-powerpoint.addin.macroEnabled.12"],
      "pps": ["application/vnd.ms-powerpoint"],
      "ppsm": ["application/vnd.ms-powerpoint.slideshow.macroEnabled.12"],
      "ppsx": ["application/vnd.openxmlformats-officedocument.presentationml.slideshow"],
      "ppt": ["application/vnd.ms-powerpoint"],
      "pptm": ["application/vnd.ms-powerpoint.presentation.macroEnabled.12"],
      "pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
      "ps": ["application/postscript"],
      "psd": ["application/x-photoshop"],
      "py": ["text/x-python"],
      "raf": ["image/x-dcraw"],
      "rar": ["application/x-rar-compressed"],
      "reveal": ["text/reveal"],
      "rss": ["application/rss+xml"],
      "rtf": ["text/rtf"],
      "rw2": ["image/x-dcraw"],
      "sgf": ["application/sgf"],
      "sh-lib": ["text/x-shellscript"],
      "sh": ["text/x-shellscript"],
      "srf": ["image/x-dcraw"],
      "sr2": ["image/x-dcraw"],
      "svg": ["image/svg+xml", "text/plain"],
      "swf": ["application/x-shockwave-flash", "application/octet-stream"],
      "tar": ["application/x-tar"],
      "tar.bz2": ["application/x-bzip2"],
      "tar.gz": ["application/x-compressed"],
      "tbz2": ["application/x-bzip2"],
      "tex": ["application/x-tex"],
      "tgz": ["application/x-compressed"],
      "tiff": ["image/tiff"],
      "tif": ["image/tiff"],
      "ttf": ["application/font-sfnt"],
      "txt": ["text/plain"],
      "vcard": ["text/vcard"],
      "vcf": ["text/vcard"],
      "vob": ["video/dvd"],
      "vsd": ["application/vnd.visio"],
      "wav": ["audio/wav"],
      "webm": ["video/webm"],
      "woff": ["application/font-woff"],
      "wpd": ["application/vnd.wordperfect"],
      "wmv": ["video/x-ms-wmv"],
      "xcf": ["application/x-gimp"],
      "xla": ["application/vnd.ms-excel"],
      "xlam": ["application/vnd.ms-excel.addin.macroEnabled.12"],
      "xls": ["application/vnd.ms-excel"],
      "xlsb": ["application/vnd.ms-excel.sheet.binary.macroEnabled.12"],
      "xlsm": ["application/vnd.ms-excel.sheet.macroEnabled.12"],
      "xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
      "xlt": ["application/vnd.ms-excel"],
      "xltm": ["application/vnd.ms-excel.template.macroEnabled.12"],
      "xltx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.template"],
      "xml": ["application/xml", "text/plain"],
      "xrf": ["image/x-dcraw"],
      "yaml": ["application/yaml", "text/plain"],
      "yml": ["application/yaml", "text/plain"],
      "zip": ["application/zip"]
  }    
};