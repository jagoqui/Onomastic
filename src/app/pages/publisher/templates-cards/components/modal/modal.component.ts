import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JoditAngularComponent } from 'jodit-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ThemeSwitcherControllerService,
} from 'src/app/shared/services/theme-switcher-controller.service';
import { FileUpload } from 'src/app/shared/upload-files/models/file-upload';

import {
  ModalMailUsersComponent,
} from '../../../users/components/modal-mail-users/modal-mail-users.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit, OnDestroy {
  @ViewChild('editor') joditEditor: JoditAngularComponent;

  private destroy$ = new Subject<any>();
  itemImages: FileUpload[] = [];
  imageSrc: string = null;
  isOverDrop = false;
  initialContent = `
    <div id="editorContent">
      <span>
        Hola&nbsp;<b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;en ésta&nbsp;<b><font color="#16a085">&lt;Fecha&gt;</font></b>&nbsp;la Universidad de Antioquia le desea un feliz cumpleaños 🥳.
      </span>
    </div>
  `;
  myContent: string;
  config: any;
  formdata: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ModalMailUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private themeSwitcherController: ThemeSwitcherControllerService
  ) {
    this.myContent = this.initialContent;
  }

  deleteEvent(event): void {
    const key = event.key; // const {key} = event; ES6+
    if (key === 'Backspace') {
      console.log('The key was deleted');
    }
  }

  editorContentVerify() {
    const content = document.getElementById('editorContent');
    if (!content) {
      this.myContent = `
        <div id="editorContent">
          ${this.myContent}
        </div>
      `;
      this.quitImage();
    }
  }

  setCardBackground(event) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(this.itemImages[0]?.file || file); // TODO: Aveces no carga la imagen('itemImages) en el editor,
    // entonces toca salta la validación y leer la imagen normal para que cargue la imagen.
  }

  _handleReaderLoaded() {
    const content = document.getElementById('editorContent');

    if (!content.children[0]?.innerHTML) {
      content.innerHTML = '&nbsp;';
    }
    content.style.backgroundImage = `url(${this.imageSrc})`;
    content.style.backgroundRepeat = 'no-repeat';
    content.style.backgroundPosition = 'center';
    content.style.backgroundSize = 'cover';
    content.style.height = 'auto';
    content.style.color = 'white';
  }

  quitImage() {
    // TODO: Error al quitar la imagen, al cargar de nuevo debe ser una imagen diferente para que carge.
    this.itemImages[0] = null;
    this.imageSrc = '';
    const content = document.getElementById('editorContent');
    if (content) {
      content.style.backgroundImage = null;
      content.style.color = 'black';
    }
  }

  resetEditor() {
    this.myContent = null;
    this.joditEditor.resetEditor();
    this.imageSrc = null;
  }

  onClickSubmit(data) {
    console.log(this.joditEditor.editor.chars);

    if (this.formdata.invalid) {
      this.formdata.get('description').markAsTouched();
    }
  }

  addName() {
    const content = document.getElementById('editorContent');
    const spanName = `<span id="name"><b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;</span>`;
    content.innerHTML += spanName;
  }

  addDate() {
    const content = document.getElementById('editorContent');
    const spanDate = `<span id="date"><b><font color="#16a085">&lt;Fecha&gt;</font></b>&nbsp;</span>`;
    content.innerHTML += spanDate;
  }

  addSchool() {
    const content = document.getElementById('editorContent');
    const spanSchool = `<span id="school"><b><font color="#9b59b6">&lt;Falcultad/Escuela&gt;</font></b>&nbsp;</span>`;
    content.innerHTML += spanSchool;
  }

  addAssociation() {
    const content = document.getElementById('editorContent');
    const spanAssociation = `<span id="association"><b><font color="#f39c12">&lt;Asociación&gt;</font></b>&nbsp;</span>`;
    content.innerHTML += spanAssociation;
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.formdata.reset();
      this.dialogRef.close();
    }
  }

  ngOnInit() {
    this.formdata = this.formBuilder.group({
      description: ['', [Validators.required,
      Validators.maxLength(400), Validators.minLength(5)]]
    });
    this.config = {
      autofocus: true,
      maxWidth: 800,
      maxHeight: 600,
      uploader: {
        insertImageAsBase64URI: true
      },
      language: 'es',
      enter: 'BR',
      theme: 'default',
      limitChars: 400,
      placeholder: 'Ingrese el texto aquí',
      showXPathInStatusbar: false,
      toolbarAdaptive: false,
      buttons: [
        'bold', 'underline', 'italic', 'strikethrough', '|',
        'font', 'fontsize', 'align', 'brush', 'paragraph', '|',
        'superscript', 'subscript', 'symbol', '|',
        'cut', 'copy', 'paste', 'eraser', '|',
        'undo', 'redo',
        '\n',
        'ol', 'ul', '|',
        'indent', 'outdent', '|',
        'table', 'hr', '|',
        'link', 'image', 'video', 'fullsize', '|',
        'selectall', 'source', 'preview', 'print', 'find', 'about'
      ],
      buttonsMD: [
        'bold', 'underline', 'italic', 'strikethrough', '|',
        'font', 'fontsize', 'align', 'brush', 'paragraph', '|',
        'superscript', 'subscript', 'symbol', '|',
        'cut', 'copy', 'paste', 'eraser', '|',
        'undo', 'redo',
        '\n',
        'ol', 'ul', '|',
        'indent', 'outdent', '|',
        'table', 'hr', '|',
        'link', 'image', 'video', 'fullsize', '|',
        'selectall', 'source', 'preview', 'print', 'find', 'about'
      ],
      buttonsSM: [
        'bold', 'underline', 'italic', 'strikethrough', '|',
        'font', 'fontsize', 'align', 'brush', 'paragraph', '|',
        'superscript', 'subscript', 'symbol', '|',
        'cut', 'copy', 'paste', 'eraser', '|',
        'undo', 'redo',
        '\n',
        'ol', 'ul', '|',
        'indent', 'outdent', '|',
        'table', 'hr', '|',
        'link', 'image', 'video', 'fullsize', '|',
        'selectall', 'source', 'preview', 'print', 'find', 'about'
      ],
      buttonsXS: [
        'bold', 'underline', 'italic', 'strikethrough', '|',
        'font', 'fontsize', 'align', 'brush', 'paragraph', '|',
        'superscript', 'subscript', 'symbol', '|',
        'cut', 'copy', 'paste', 'eraser', '|',
        'undo', 'redo',
        '\n',
        'ol', 'ul', '|',
        'indent', 'outdent', '|',
        'table', 'hr', '|',
        'link', 'image', 'video', 'fullsize', '|',
        'selectall', 'source', 'preview', 'print', 'find', 'about'
      ],
    };
    this.themeSwitcherController.themeClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (theme: string) => (this.config.theme = theme === 'light-theme' ? 'default' : 'dark')
        // TODO: Detectar evento de preview para poner tema claro.
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
