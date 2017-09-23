import {
  Component,
  AfterViewInit,
  EventEmitter,
  OnDestroy,
  Input,
  Output,
  HostListener
} from '@angular/core';

import { MainService } from '../../services/main.service';
import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/table';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/code';






declare var tinymce: any;

@Component({
  selector: 'app-tiny-editor',
  template: `
  <div class="form-group">
    <textarea style="height: 40vh" id="body" name="body" class="form-control"></textarea>
  </div>`
})
export class TinyEditorComponent implements AfterViewInit, OnDestroy {
  @Output() onEditorContentChange = new EventEmitter();
  @Input() setBody: String;
  serverAddress: String;
  @HostListener('window:unload', [ '$event' ])
  beforeUnloadHandler(event) {
    tinymce.remove(this.editor);
  }

  constructor(
    private mainService: MainService,
  ) {
    this.serverAddress = this.mainService.getServerAddress();
  }

  editor;

  ngAfterViewInit() {
    tinymce.init({
      selector: '#body',
      plugins: ['link', 'table', 'paste', 'image', 'fullscreen', 'lists', 'insertdatetime', 'charmap', 'textcolor', 'code'],
      menubar: false,
      toolbar: 'styleselect | fontsizeselect | bullist numlist | bold italic underline removeformat | indent outdent | alignleft aligncenter alignright | forecolor backcolor | subscript superscript | insert table | fullscreen',
      skin_url: 'assets/skins/lightgray',
      paste_data_images: true,
      relative_urls: false,
      branding: true,
      setup: editor => {
        this.editor = editor;
        editor.on('init', () => {
          if (this.setBody) {
           editor.setContent(this.setBody);
         }
        });
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.onEditorContentChange.emit(content);
        });
      }
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
