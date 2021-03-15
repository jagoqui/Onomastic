import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateCardsService } from '@app/pages/publisher/services/template-cards.service';
import { ThemeSwitcherControllerService } from '@shared/services/theme-switcher-controller.service';
import { JoditAngularComponent } from 'jodit-angular';
import { Subject } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { environment } from '@env/environment';
import { Plantilla } from '@shared/models/template-card.model';
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

  jodit: JoditAngularComponent;
  actionTODO = '';
  cardTemplateImage: File;
  initialContent = `
    <span>
        Hola&nbsp;<b id='name' class='labels' style='color: #e74c3c'>&lt;Nombre&gt;</b>&nbsp;en ésta&nbsp;
        <b id='school' class='labels' style='color: #16a085'>&lt;Fecha&gt;</b>
        &nbsp;la Universidad de Antioquia le desea un feliz cumpleaños 🥳.
     </span>
  `;
  config: any;
  onCompleteCard = false;
  private destroy$ = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<ModalTemplateCardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private themeSwitcherController: ThemeSwitcherControllerService,
    private templateCardsService: TemplateCardsService,
    private authSvc: AuthService
  ) {
  }

  editorContentVerify() {
    const cardImg = document.getElementById('templateCardImage');
    this.onCompleteCard = !!cardImg;
  }

  onDelete(event: KeyboardEvent) {
    const { key } = event;
    if (key === 'Backspace') {
      const editor = document.getElementsByClassName('jodit-wysiwyg')[0];
      console.log(editor);
      if (editor?.children[editor.children.length - 1]?.className === 'labels') {
        const id = editor.children[editor.children.length - 1].id;
        console.log(id);
        document.getElementById(id).remove();
      }
    }
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.joditEditor.resetEditor();
      this.dialogRef.close();
    }
  }

  onSave() {
    const card: Plantilla = {
      texto: this.joditEditor.editor.value,
      asociacionesPorPlantilla: [
        {
          id: 7,
          nombre: 'Escuela de Microbiología'
        }
      ]
    };
    this.templateCardsService.newCardTemplate(card, this.cardTemplateImage).subscribe((cardRes) => {
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
        url: `${environment.uploadImagesServer}/${this.authSvc.getUserId()}temp.jpg`,
        imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
        format: 'json',
        pathVariableName: `${this.authSvc.getUserId()}temp.jpg`,
        fileVariableName: 'file',
        withCredentials: false,
        method: 'POST',
        prepareData: (formData) => {
          if (document.getElementById('templateCardImage')) {
            //TODO: Posible problema de sincronización, puede que no reemplaze la plantilla
            return SwAlert.fire({
              title: 'Sólo puede cargarse una plantilla!',
              text: ' Desea reemplazar la plantilla actual?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, reemplazarla!',
              cancelButtonText: 'Cancelar'
            }).then((resultReplace) => {
              if (resultReplace.isConfirmed) {
                return this.loadCardImage(formData);
              }else{
                return null;
              }
            }).then(r => console.log(r));
          }else{
            return this.loadCardImage(formData);
          }
        },
        isSuccess: (resp) => !resp.error,
        getMsg: (resp) => resp.msg.join !== undefined ? resp.msg.join(' ') : resp.msg,
        process: (res) => res.fileDownloadUri,
        error: (error) => {
          this.joditEditor.editor.events.fire('errorMessage', error.message, 'error', 4e3);
        },
        defaultHandlerSuccess: (fileDownloadUri) => {
          if (fileDownloadUri) {
            const image = document.createElement('img') as HTMLImageElement;
            image.src = fileDownloadUri;
            image.id = 'templateCardImage';
            image.style.display = 'block';
            image.style.margin = 'auto';
            this.joditEditor.editor.selection.insertImage(image);
          }
        },
        defaultHandlerError: (error) => {
          this.joditEditor.editor.events.fire('errorMessage', error.message);
        },
        contentType: (e) => (void 0 === this.joditEditor.editor.ownerWindow.FormData || 'string' == typeof e) &&
          'application/x-www-form-urlencoded; charset=UTF-8'
      },
      buttons: [
        'font', 'paragraph', 'fontsize', 'brush', '|',
        'bold', 'underline', 'italic', 'strikethrough', '|',
        'align', 'indent', 'outdent', '|',
        'ol', 'ul', '|',
        'table', 'hr', '|',
        'superscript', 'subscript', 'symbol', '|',
        'eraser', 'selectall', '|', 'image', 'print', '|', 'labels', '|',
        '\n',
        'undo', 'redo', 'reset', 'preview', 'fullsize', '|', 'source', 'about', 'theme'
      ],
      controls: {
        labels: {
          name: 'Estiquetas',
          tooltip: 'Etiquetas para automatizar la plantilla',
          list: {
            name: 'Nombre',
            date: 'Fecha',
            school: 'Facultad/Escuela',
            bodyType: 'Estamento'
          },
          exec: (editor, _, $btn) => {
            const key = $btn.control.text;
            switch (key) {
              case 'Nombre': {
                editor.selection.insertHTML('<b id="name" class ="labels" title="Nombre del usuario de correo.">&lt;NOMBRE&gt;<b>&nbsp;');
                break;
              }
              case 'Fecha': {
                editor.selection.insertHTML('<b id="date" class ="labels" title="Día que se envia el evento.">&lt;FECHA&gt;<b>&nbsp;');
                break;
              }
              case 'Facultad/Escuela': {
                editor.selection.insertHTML(
                  '<b id="school" class ="labels" title="Facultad de ingeniería, escuela de artes ...">&lt;FALCUTAD/ESCUELA&gt;<b>&nbsp;'
                );
                break;
              }
              case 'Estamento': {
                editor.selection.insertHTML(
                  '<b id= "bodyType" class ="labels" title="Estudiante, prodesor, auxiliar ...">&ltESTAMENTO&gt;<b>&nbsp;'
                );
                break;
              }
              default: {
                break;
              }
            }
            return;
          }
        },
        reset: {
          name: 'Reset',
          tooltip: 'Lleva el editor al estado inicial ...',
          exec: (editor) => {
            //TODO: Posicionar cursor al final del dom
            editor.value = this.initialContent;
          }
        }
      }
    };
  }

  loadCardImage(formData) {
    const file = formData.getAll('files[0]')[0];
    const validFormatImage = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'];
    if (validFormatImage.includes(file.type)) {
      formData.append('file', file);
      this.cardTemplateImage = file;
      return formData;
    } else {
      SwAlert.fire(
        {
          icon: 'warning',
          title: 'Oops...',
          text: 'La plantilla sólo puede tener formato, [jpg, png, jpeg, gif]!'
        }
      ).then(r => console.log(r));
      return null;
    }
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
