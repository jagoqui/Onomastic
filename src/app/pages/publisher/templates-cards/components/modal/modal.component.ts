import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CKEditorComponent } from 'ng2-ckeditor/ckeditor.component';
import { FileUpload } from 'src/app/shared/upload-files/models/file-upload';

import {
  ModalMailUsersComponent,
} from '../../../users/components/modal-mail-users/modal-mail-users.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {

  @Output() cahange: EventEmitter<File> = new EventEmitter<File>();
  @ViewChild('textEditor') ckeditor: CKEditorComponent;
  @ViewChild('htmlContent') htmlContent: ElementRef;

  mycontent: string;
  source = '';
  ckeConfig: any;
  itemImages: FileUpload[] = [];
  imageSrc: string = null;
  isOverDrop = false;

  constructor(
    private dialogRef: MatDialogRef<ModalMailUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mycontent = `<p>Hola&nbsp;<!--<p--><span style="color:#e74c3c"><strong>&lt;Nombre&gt;&nbsp;</strong></span>en esta&nbsp;<!--<p--><span style="color:#16a085"><strong>&lt;Fecha&gt; </strong></span>la Universidad de Antioquia le desea un feliz cumplea&ntilde;os</p>`;
  }

  quitImage() {
    this.itemImages[0] = null;
    this.imageSrc = null;
  }

  loadHtmlContent(content) {
    this.htmlContent.nativeElement.innerHTML = content;
  }

  addName() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length - 3).concat(`<p id="name"><span style="color:#e74c3c"><strong>&lt;Nombre&gt;</strong></span>&nbsp;</p>`);
    // this.ckeditor.editing.view.focus();
  }

  addDate() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length - 3).concat(`<p id="date"><span style="color:#16a085"><strong>&lt;Fecha&gt;</strong></span>&nbsp;</p>`);
  }

  addSchool() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length - 3).concat(`<p id="school"><span style="color:#9b59b6"><strong>&lt;Facultad/Escuela&gt;</strong></span>&nbsp;</p>`);
  }

  addAssociation() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length - 3).concat(`<p id="association"><span style="color:#f39c12"><strong>&lt;Asociación&gt;</strong></span>&nbsp;</p>`);
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      // this.mailUserForm.onReset();
      this.dialogRef.close();
    }
  }

  ngOnInit() {
    this.ckeConfig = {
    };
  }
}
