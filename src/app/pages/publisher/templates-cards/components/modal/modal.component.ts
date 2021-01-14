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
  imgB64: string = null;
  isOverDrop = false;
  mycontent: string;
  config: any;
  htmlContentWithoutStyles = '';
  formdata: FormGroup;
  imgBase64: string = null;

  constructor(
    private dialogRef: MatDialogRef<ModalMailUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private themeSwitcherController: ThemeSwitcherControllerService
  ) {
    this.mycontent = `<div id="imgb">Hola&nbsp;<span><b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;en ésta&nbsp;<b><font color="#16a085">&lt;Fecha&gt;</font></b>&nbsp;la Universidad de Antioquia le desea un feliz cumpleaños 🥳.</span>
  </div>`;
    this.htmlContentWithoutStyles = this.mycontent;
  }

  quitImage() {
    this.itemImages[0] = null;
    this.imageSrc = null;
    const imagen = document.getElementById('imgb');
    imagen.style.backgroundImage = `url(${this.imageSrc})`;
  }

  resetEditor() {
    console.log(this.imageSrc);
    this.mycontent = '';
    this.htmlContentWithoutStyles = '';
    this.joditEditor.resetEditor();
  }

  showHTML() {
    this.htmlContentWithoutStyles = document.getElementById('htmlDiv').innerHTML;
  }

  onClickSubmit(data) {
    if (this.formdata.invalid) {
      this.formdata.get('description').markAsTouched();
    }
  }

  public picked(event) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    this.imgBase64 = reader.result;
    const imagen = document.getElementById('imgb');
    imagen.style.backgroundImage = `url(${this.imageSrc})`;
    imagen.style.backgroundRepeat = 'no-repeat';
    imagen.style.backgroundPosition = 'center';
    imagen.style.backgroundSize = 'cover';
    imagen.style.height = '500px';
  }

  addName() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length).concat(`<span id="name"><b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;</span>`);
    //this.joditEditor.element.innerHTML = `<span id="name"><b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;</span>`;
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
      uploader: {
        insertImageAsBase64URI: true
      },
      language: 'es',
      theme: 'default',
      limitChars: 400,
      toolbarButtonSize: 'small',
      showXPathInStatusbar: false,
      toolbarAdaptive: true,
      disablePlugins: 'enter,table,about,delete,clean-html,wrap-text-nodes,placeholder,iframe,video,file,print,table-keyboard-navigation,select-cells,resize-cells'

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
