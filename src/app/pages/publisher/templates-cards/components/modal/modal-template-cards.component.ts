import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateCardsService } from '@app/pages/publisher/services/template-cards.service';
import { Plantilla } from '@app/shared/models/template-card.model';
import { ThemeSwitcherControllerService } from '@shared/services/theme-switcher-controller.service';
import { FileUpload } from '@shared/upload-files/models/file-upload';
import { JoditAngularComponent } from 'jodit-angular';
import { Subject } from 'rxjs';
import SwAlert from 'sweetalert2';

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
    }
  }

  resetEditor() {
    this.editorForm.get('text').setValue(null);
    this.joditEditor.resetEditor();
    this.imageSrc = null;
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

  setEditorConfig() {
    this.config = {
      autofocus: true,
      minHeight: 600,
      language: 'es',
      enter: 'BR',
      theme: 'default',
      limitChars: 400,
      placeholder: 'Ingrese el texto aquí',
      showXPathInStatusbar: false,
      toolbarAdaptive: false,
      uploader: {
        url: 'https://xdsoft.net/jodit/finder/?action=fileUpload',
        imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
        // data: {
        //   dir: this.itemImages[0]
        // },
        // baseurl: 'relativePathURL',
        // process: (response) => {
        //   let files = [5];
        //   response.list.map((file) => {
        //     files.push(file.name);
        //   });
        //   return {
        //     files,
        //     path: 'http://arquimedes.udea.edu.co:8096/onomastico/images/12background.jpg',
        //     baseurl: '/content/assets',
        //     error: (response.success ? 0 : 1),
        //     msg: response.message
        //   };
        // },
        defaultHandlerSuccess: (response) => {
          if (response.files && response.files.length) {
            for (const resFile of response.files) {
              const fullFilePath = response.path + response.files;
              this.joditEditor.editor.selection.insertImage(
                'http://arquimedes.udea.edu.co:8096/onomastico/images/12background.jpg'
              );
              // this.joditEditor.editor.selection.insertImage(
              //   fullFilePath
              // );
            }
          }
        }
      },
      buttons: [
        'font', 'paragraph', 'fontsize', 'brush', '|',
        'bold', 'underline', 'italic', 'strikethrough', '|',
        'align', 'indent', 'outdent', '|',
        'ol', 'ul', '|',
        'table', 'hr', '|',
        'superscript', 'subscript', 'symbol', '|',
        'eraser', 'selectall', '|', 'image', 'print', '|', 'name', 'date', 'school', 'bodyType', '|', 'theme',
        '\n',
        'undo', 'redo', 'preview', 'fullsize', '|', 'source', 'about'
      ],
      controls: {
        name: {
          name: 'Nombre',
          tooltip: 'Nombre del usuario de correo.',
          exec: (editor) => {
            editor.selection.insertHTML('<b title="Nombre del usuario de correo.">&lt;NOMBRE&gt;<b>&nbsp;');
          }
        },
        date: {
          name: 'Fecha',
          tooltip: 'Día que se envia el evento',
          exec: (editor) => {
            editor.selection.insertHTML('<b title="Día que se envia el evento.">&lt;FECHA&gt;<b>&nbsp;');
          }
        },
        school: {
          name: 'Facultad/Escuela',
          tooltip: 'Facultad de ingeniería, escuela de artes ...',
          exec: (editor) => {
            editor.selection.insertHTML('<b title="Facultad de ingeniería, escuela de artes ...">&lt;FALCUTAD/ESCUELA&gt;<b>&nbsp;');
          }
        },
        bodyType: {
          name: 'Estamento',
          tooltip: 'Si es estudiante, profesor, auxiliar ...',
          exec: (editor) => {
            editor.value = '';
            editor.selection.insertHTML('<b title="Si es estudiante, profesor, auxiliar ...">&lt;ESTAMENTO&gt;<b>&nbsp;');
          }
        },
        theme: {
          label: 'Theme',
          name: 'theme',
          value: 'dark',
          radio: true,
          options: [
            { value: 'default', text: 'Light' },
            { value: 'dark', text: 'Dark' }
          ],
          onChange: (values) => {
            this.joditEditor.editor.state.theme = values[0].value as string;
          }
        }
      }
    };
  }

  ngOnInit() {
    if (this.data?.card) {
      this.actionTODO = Action.edit;
    } else {
      this.actionTODO = Action.new;
    }
    this.setEditorConfig();
    this.themeSwitcherController.themeClass$
      .subscribe(
        (theme: string) => (this.config.theme = theme === 'light-theme' ? 'default' : 'dark')
      );
  };

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}
