import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateCardsService } from '@app/pages/publisher/services/template-cards.service';
import { Plantilla } from '@app/shared/models/template-card.model';
import { ThemeSwitcherControllerService } from '@shared/services/theme-switcher-controller.service';
import { FileUpload } from '@shared/upload-files/models/file-upload';
import { JoditAngularComponent } from 'jodit-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import SwAlert from 'sweetalert2';

// eslint-disable-next-line no-shadow
enum Action {
  edit = 'Actualizar',
  new = 'Agregar',
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal-template-cards.component.html',
  styleUrls: ['./modal-template-cards.component.scss']
})
export class ModalTemplateCardsComponent implements OnInit, OnDestroy {
  @ViewChild('editor') joditEditor: JoditAngularComponent;

  actionTODO = '';
  itemImages: FileUpload[] = [];
  imageSrc: string = null;
  isOverDrop = false;
  initialContent = `
    <div id='editorContent' style='z-index: -1'>
      <span>
        Hola&nbsp;<b style='color: #e74c3c'>&lt;Nombre&gt;</b>&nbsp;en ésta&nbsp;
        <b style='color: #16a085'>&lt;Fecha&gt;</b>
        &nbsp;la Universidad de Antioquia le desea un feliz cumpleaños 🥳.
      </span>
    </div>
  `;
  myContent: string;
  config: any;
  editorForm: FormGroup;
  private destroy$ = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<ModalTemplateCardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private themeSwitcherController: ThemeSwitcherControllerService,
    private templateCardsService: TemplateCardsService
  ) {
    this.editorForm = this.formBuilder.group({
      text: [this.initialContent, [Validators.required, Validators.maxLength(400), Validators.minLength(5)]]
    });
  }


  editorContentVerify() {
    const content = document.getElementById('editorContent');
    if (!content) {
      this.editorForm.get('text').setValue(`
        <div id='editorContent'>
          ${this.editorForm.value.text} <!-- TODO: Poner el cursor dentro del div-->
        </div>`
      );
      this.quitImage();
    }
  }

  setCardBackground(event) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(this.itemImages[0]?.file || file); // TODO: Aveces no carga la imagen('itemImages) en el editor,
    // entonces toca salta la validación y leer la imagen normal para que cargue la imagen.
  }

  handleReaderLoaded() {
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
    this.editorForm.get('text').setValue(null);
    this.joditEditor.resetEditor();
    this.imageSrc = null;
  }

  onClickSubmit(data) {
    if (this.editorForm.invalid && data) {
      this.editorForm.get('text').markAsTouched();
    }
  }

  addName() {
    const content = document.getElementById('editorContent');
    const spanName = `<span id='name'><b style='color: #e74c3c'>&lt;Nombre&gt;</b>&nbsp;</span>`;
    content.innerHTML += spanName;
  }

  addDate() {
    const content = document.getElementById('editorContent');
    const spanDate = `<span id='date'><b style='color: #16a085'>&lt;Fecha&gt;</b>&nbsp;</span>`;
    content.innerHTML += spanDate;
  }

  addSchool() {
    const content = document.getElementById('editorContent');
    const spanSchool = `<span id='school'><b style='color: #9b59b6'>&lt;Falcultad/Escuela&gt;</b>&nbsp;</span>`;
    content.innerHTML += spanSchool;
  }

  addAssociation() {
    const content = document.getElementById('editorContent');
    const spanAssociation = `<span id='association'><b style='color: #f39c12'>&lt;Asociación&gt;</b>&nbsp;</span>`;
    content.innerHTML += spanAssociation;
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.editorForm.reset();
      this.dialogRef.close();
    }
  }

  onSave() {
    const editorContent = document.getElementById('editorContent').innerHTML;

    const card: Plantilla = {
      texto: editorContent,
      asociacionesPorPlantilla: [
        {
          id: 7,
          nombre: 'Escuela de Microbiología'
        }
      ]
    };

    this.templateCardsService.newCardTemplate(card, this.itemImages[0]?.file).subscribe((cardRes) => {
      if (cardRes) {
        SwAlert.fire('Guardado!', '', 'success').then(r => console.log(r));
        this.onClose(true);
      }

    }, (err) => {
      SwAlert.fire({
        icon: 'error',
        html: '',
        title: 'Oops...',
        text: ' Algo salió mal!',
        footer: `${err}`
      }).then(r => console.log(r));
    });
  }

  ngOnInit() {
    if (this.data?.card) {
      this.actionTODO = Action.edit;
    } else {
      this.actionTODO = Action.new;
    }

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
      download: {
        url: 'https://xdsoft.net/jodit/finder/?action=fileUpload'
        // format: 'json',
        // method: 'POST',
      },
      uploader: {
        url: 'https://xdsoft.net/jodit/finder/?action=fileUpload',
        insertImageAsBase64URI: false,
        imagesExtensions: [
          'jpg',
          'png',
          'jpeg',
          'gif'
        ],
        headers: null,
        data: null,
        filesVariableName: (e) => 'files[' + e + ']',
        withCredentials: false,
        pathVariableName: 'path',
        format: 'json',
        method: 'POST',
        prepareData: (e) => e,
        isSuccess: (e) => e.success,
        // getMessage: (e) => void 0 !== e.data.messages && this.joditEditor.editor.s.isArray(e.data.messages) ?
        //   e.data.messages.join(' ') : '',
        process: (e) => e.data,
        error: (e) => {
          this.joditEditor.editor.e.fire('errorMessage', e.message, 'error', 4e3);
        },
        // defaultHandlerSuccess: (e) => {
        //   const t = this.joditEditor.editor || this;
        //   this.joditEditor.editor.s.isJoditObject(t) && e.files && e.files.length && e.files.forEach(((n, r) => {
        //     const o = e.isImages && e.isImages[r] ? ['img', 'src'] : ['a', 'href'];
        //     const i = o[0];
        //     const a = o[1];
        //     const s = t.createInside.element(i);
        //     this.joditEditor.editor.s.setAttribute(a, e.baseurl + n), 'a' === i && (s.textContent = e.baseurl + n),
        //       'img' === i ? t.s.insertImage(s, null, t.o.imageDefaultWidth) : t.s.insertNode(s);
        //   }));
        // },
        defaultHandlerError: (e) => {
          console.log('errorMessage', e.message);
          this.joditEditor.editor.e.fire('errorMessage', e.message);
        },
        contentType(e) {
          return (void 0 === this.j.ow.FormData || 'string' == typeof e) && 'application/x-www-form-urlencoded; charset=UTF-8';
        }
      },
      disablePlugins: 'iframe,video,media,image',
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
        'selectall', 'source', 'file', 'image', 'print', 'find', 'fullsize', 'preview', 'about'
      ]
      // buttonsMD: [
      //   'bold', 'underline', 'italic', 'strikethrough', '|',
      //   'font', 'fontsize', 'align', 'brush', 'paragraph', '|',
      //   'superscript', 'subscript', 'symbol', '|',
      //   'cut', 'copy', 'paste', 'eraser', '|',
      //   'undo', 'redo',
      //   '\n',
      //   'ol', 'ul', '|',
      //   'indent', 'outdent', '|',
      //   'table', 'hr', '|', 'fullsize',
      //   'selectall', 'source', 'preview', 'print', 'find', 'about'
      // ],
      // buttonsSM: [
      //   'bold', 'underline', 'italic', 'strikethrough', '|',
      //   'font', 'fontsize', 'align', 'brush', 'paragraph', '|',
      //   'superscript', 'subscript', 'symbol', '|',
      //   'cut', 'copy', 'paste', 'eraser', '|',
      //   'undo', 'redo',
      //   '\n',
      //   'ol', 'ul', '|',
      //   'indent', 'outdent', '|',
      //   'table', 'hr', '|', 'fullsize',
      //   'selectall', 'source', 'preview', 'print', 'find', 'about'
      // ],
      // buttonsXS: [
      //   'bold', 'underline', 'italic', 'strikethrough', '|',
      //   'font', 'fontsize', 'align', 'brush', 'paragraph', '|',
      //   'superscript', 'subscript', 'symbol', '|',
      //   'cut', 'copy', 'paste', 'eraser', '|',
      //   'undo', 'redo',
      //   '\n',
      //   'ol', 'ul', '|',
      //   'indent', 'outdent', '|',
      //   'table', 'hr', '|', 'fullsize',
      //   'selectall', 'source', 'preview', 'print', 'find', 'about'
      // ]
    };

    this.themeSwitcherController.themeClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (theme: string) => (this.config.theme = theme === 'light-theme' ? 'default' : 'dark')
        // TODO: Detectar evento de preview para poner tema claro.
      );

  };

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}
