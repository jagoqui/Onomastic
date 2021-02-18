import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  TemplateCardsService,
} from '@app/pages/publisher/services/template-cards.service';
import { Plantilla } from '@app/shared/models/template-card.model';
import {
  ThemeSwitcherControllerService,
} from '@shared/services/theme-switcher-controller.service';
import { FileUpload } from '@shared/upload-files/models/file-upload';
import { JoditAngularComponent } from 'jodit-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import SwAlert from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-template-cards.component.html',
  styleUrls: ['./modal-template-cards.component.scss']
})
export class ModalTemplateCardsComponent implements OnInit, OnDestroy {
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
  uploadForm: FormGroup;
  editorForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ModalTemplateCardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private themeSwitcherController: ThemeSwitcherControllerService,
    private templateCardsSevice: TemplateCardsService
  ) { }

  deleteEvent(event): void {
    const key = event.key; // const {key} = event; ES6+
    if (key === 'Backspace') {
      console.log(this.joditEditor.editor.selection);
    }
  }

  editorContentVerify() {
    const content = document.getElementById('editorContent');
    if (!content) {
      this.editorForm.get('description').setValue(`
        <div id="editorContent">
          ${this.editorForm.value.description}
        </div>`
      );
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
    content.style.minHeight = '300px';
    content.style.color = 'white';
  }

  quitImage() {
    // TODO: Error al quitar la imagen, al cargar de nuevo debe ser una imagen diferente para que carge. Solo paasa en algunos navegadores
    this.itemImages[0] = null;
    this.imageSrc = '';
    const content = document.getElementById('editorContent');
    if (content) {
      content.style.backgroundImage = null;
      content.style.color = 'black';
    }
  }

  resetEditor() {
    this.editorForm.get('description').setValue(null);
    this.joditEditor.resetEditor();
    this.imageSrc = null;
  }

  onClickSubmit(data) {
    console.log(this.joditEditor.editor.chars);

    if (this.editorForm.invalid) {
      this.editorForm.get('description').markAsTouched();
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
      this.editorForm.reset();
      this.dialogRef.close();
    }
  }

  onSave() {
    const formData = new FormData();
    const card: Plantilla = {
      texto: this.editorForm.value.description,
      asociacionesPorPlantilla: [
        {
          id: 7,
          nombre: 'Escuela de Microbiología'
        }
      ]
    };

    const content = document.getElementById('editorContent');
    if (content) {
      content.style.backgroundImage = null;
      content.style.color = 'black';
    }

    this.templateCardsSevice.newCardTemplate(card, this.itemImages[0]?.file).subscribe((cardRes) => {
      console.log('Card created:>', cardRes);
      SwAlert.fire(
        'Guardado',
        'La plantilla ha sido guardada.',
        'success'
      );
      this.onClose(true);
    }, (err) => {
      console.log('Error in saving card template! :> ', err);
    });
  }

  ngOnInit() {
    this.editorForm = this.formBuilder.group({
      description: ['', [Validators.required,
      Validators.maxLength(400), Validators.minLength(5)]]
    });
    this.config = {
      autofocus: true,
      maxWidth: 800,
      maxHeight: 600,
      language: 'es',
      enter: 'BR',
      theme: 'default',
      limitChars: 400,
      placeholder: 'Ingrese el texto aquí',
      showXPathInStatusbar: false,
      toolbarAdaptive: false,
      disablePlugins: 'iframe,video,media,file,image,image-processor,image-properties,xpath',
      buttons: [
        'bold', 'underline', 'italic', 'strikethrough', '|',
        'font', 'fontsize', 'align', 'brush', 'paragraph', '|',
        'superscript', 'subscript', 'symbol', '|',
        'cut', 'copy', 'paste', 'eraser', '|',
        'undo', 'redo',
        '\n',
        'ol', 'ul', '|',
        'indent', 'outdent', '|',
        'table', 'hr', '|', 'fullsize',
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
        'table', 'hr', '|', 'fullsize',
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
        'table', 'hr', '|', 'fullsize',
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
        'table', 'hr', '|', 'fullsize',
        'selectall', 'source', 'preview', 'print', 'find', 'about'
      ]
    };

    this.editorForm.get('description').setValue(this.initialContent);
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
