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
  mycontent: string;
  config: any;
  htmlContentWithoutStyles = '';
  formdata: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ModalMailUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private themeSwitcherController: ThemeSwitcherControllerService
  ) {
    this.mycontent = `Hola&nbsp;<span><b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;en ésta&nbsp;<b><font color="#16a085">&lt;Fecha&gt;</font></b>&nbsp;la Universidad de Antioquia le desea un feliz cumpleaños 🥳.</span>`;
    this.htmlContentWithoutStyles = this.mycontent;
  }

  quitImage() {
    this.itemImages[0] = null;
    this.imageSrc = null;
  }

  resetEditor() {
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

  addName() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length).concat(`<span id="name"><b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;</span>`);
    // this.joditEditor.element.innerHTML = `<span id="name"><b><font color="#e74c3c">&lt;Nombre&gt;</font></b>&nbsp;</span>`;
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
      enter: 'DIV'
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
