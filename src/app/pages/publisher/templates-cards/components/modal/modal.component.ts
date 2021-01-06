import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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
  @ViewChild('htmlContent') htmlContent: ElementRef;

  itemImages: FileUpload[] = [];
  imageSrc: string = null;
  isOverDrop = false;
  mycontent: string;
  config: AngularEditorConfig;
  htmlContentWithoutStyles = '';
  formdata: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ModalMailUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.mycontent = `Hola&nbsp;<span><b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;en ésta&nbsp;<b><font color="#16a085">&lt;Fecha&gt;</font></b>&nbsp;la Universidad de Antioquia le desea un feliz cumpleaños 🥳.</span>`;
    this.htmlContentWithoutStyles = this.mycontent;
  }

  quitImage() {
    this.itemImages[0] = null;
    this.imageSrc = null;
  }

  showHTML() {
    this.htmlContentWithoutStyles = document.getElementById('htmlDiv').innerHTML;
  }

  onClickSubmit(data) {
    if (this.formdata.invalid) {

      this.formdata.get('description').markAsTouched();

    }
  }

  loadHtmlContent(content) {
    this.htmlContent.nativeElement.innerHTML = content;
  }

  addName() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length).concat(`<span id="name"><b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;</span>`);
    // this.ckeditor.editing.view.focus();
  }

  addDate() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length).concat(`<span id="date"><b><font color="#16a085">&lt;Fecha&gt;</font></b>&nbsp;</span>`);
  }

  addSchool() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length).concat(`<span id="date"><b><font color="#9b59b6">&lt;Falcultad/Escuela&gt;</font></b>&nbsp;</span>`);
  }

  addAssociation() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length).concat(`<span id="date"><b><font color="#f39c12">&lt;Asociación&gt;</font></b>&nbsp;</span>`);
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      // this.mailUserForm.onReset();
      this.dialogRef.close();
    }
  }

  ngOnInit() {
    this.formdata = this.formBuilder.group({
      description: ['', [Validators.required,
      Validators.maxLength(400), Validators.minLength(5)]]
    });
    this.config = {
      editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Ingrese el texto aquí...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' }
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      uploadUrl: 'v1/image',
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
    };
  }
}
