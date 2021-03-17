import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateCardsService } from '@app/pages/publisher/services/template-cards.service';
import { ThemeSwitcherControllerService } from '@shared/services/theme-switcher-controller.service';
import { JoditAngularComponent } from 'jodit-angular';
import { Subject } from 'rxjs';
import { Plantilla } from '@shared/models/template-card.model';
import SwAlert from 'sweetalert2';
import { UploadImageService } from '@pages/¨publisher/services/upload-image.service';

enum Action {
  edit = 'Actualizar',
  new = 'Agregar',
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal-template-cards.component.html',
  styleUrls: ['./modal-template-cards.component.scss']
})
export class ModalTemplateCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editor') joditEditor: JoditAngularComponent;

  jodit: JoditAngularComponent;
  maxChars = 400;
  actionTODO = '';
  cardTemplateImage: File;
  initialContent = `
    <span>
      Hola <b id='name' class='labels' title='Nombre del usuario de correo.'>&lt;NOMBRE&gt;</b> en ésta
      <b id='date' class='labels' title='Día que se envia el evento.'>&lt;FECHA&gt;</b>, la
      <b id='school' class='labels' title='Facultad de ingeniería, escuela de artes ...'>&lt;FALCUTAD/ESCUELA&gt;</b>
      de la Universidad de Antioquia le queremos desear un feliz cumpleaños 🥳, tu cómo parte del grupo de
      <b id='bodyType' class='labels' title='Estudiante, prodesor, auxiliar ...'>&ltESTAMENTO&gt;</b>, eres muy importante
      para nosotros.
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
    private uploadImagesSvc: UploadImageService
  ) {
  }

  editorContentVerify() {
    const editorContentText = this.joditEditor.editor.text;
    if (editorContentText.length > this.maxChars) {
      SwAlert.fire({
        title: `No puede agregar más texto!`,
        html: `Sobrepasó  los <br>${this.maxChars}</b> de máximo de caracteres permitidos.`,
        icon: 'warning'
      }).then(r => console.log(r));
    }

    const cardImg = document.getElementById('templateCardImage');
    this.onCompleteCard = !!cardImg;
  }

  onDelete(event: KeyboardEvent) {
    const { key } = event;
    if (key === 'Backspace' || key === 'Delete') {
      console.log(this.joditEditor.editor.selection.j);

      const editor = document.getElementsByClassName('jodit-wysiwyg')[0];
      // const srcRemove = imgCard.getAttributeNode('src').value;
      //TODO: Eliminar imagen del servidor
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
      id: this.data?.card?.id? this.data.card.id : null,
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
        SwAlert.fire(this.data?.card? 'Actualizada!': 'Guardada!', '', 'success').
          then(r => console.log(`Se ${this.data?.card? 'actualizó':'guardó'} la plantilla exitosamente.`, r));
        this.onClose(true);
      }
    }, (err) => {
      SwAlert.fire({
        icon: 'error',
        html: `La plantilla no se  ${this.data?.card? 'actualizó':'guardó'}`,
        title: 'Oops...',
        text: 'Algo salió mal!',
        footer: `<span style = "color:red">${err}</span>`,
      }).then(r => console.warn(`Error la plantilla no se pudo ${this.data?.card? 'actualizar':'guardar'} la plantilla.`, r));
    });
  }

  setEditorConfig() {
    this.config = {
      autofocus: true,
      minHeight: 600,
      language: 'es',
      enter: 'BR',
      theme: 'default',
      toolbarButtonSize: 'large',
      limitChars: this.maxChars,
      placeholder:
        `
          Ingrese el texto aquí:<br><br>
          <hr><hr>
          <b>Nota importane</b>:<br>
          Recuerde que el texto debe contener <b>al menos una condición</b> y no puede superar los <b>${this.maxChars}</b></b>
          caracteres,además recuerde que, debe subir una imagen con la plantilla que cumpla con el siguiente formato
          <b>['image/jpg', 'image/png', 'image/jpeg', 'image/gif']</b>.<br>
          Ejemplo:<br><br>
           ${this.initialContent}<br>
           <img src='http://arquimedes.udea.edu.co:8096/onomastico/images/3temp.jpg' id='templateCardImage'
           style='display: block; margin: auto; max-width:30%' alt=''>
        `,
      showXPathInStatusbar: true,
      toolbarAdaptive: false,
      insertImageAsBase64URI: false,
      buttons: [
        'font', 'paragraph', 'fontsize', 'brush', '|',
        'bold', 'underline', 'italic', 'strikethrough', '|',
        'align', 'indent', 'outdent', '|',
        'ol', 'ul', '|',
        'table', 'hr', '|',
        'superscript', 'subscript', 'symbol', '|',
        'eraser', 'selectall', 'copyTrash', '|', 'imageUpload', 'print', '|', 'labels', '|',
        '\n',
        'undo', 'redo', 'reset', 'preview', 'fullsize', '|', 'source', 'about', 'theme', 'info'
      ],
      controls: {
        copyTrash: {
          name: 'copy',
          tooltip: 'Copiar a la papelera',
          exec: (editor) => {
            editor.execCommand('selectall');
            editor.execCommand('copy');
            alert('Text in your clipboard');
          }
        },
        labels: {
          name: 'copyformat',
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
                editor.selection.insertHTML('<b id="name" class ="labels" title="Nombre del usuario de correo.">&lt;NOMBRE&gt;</b>&nbsp;');
                break;
              }
              case 'Fecha': {
                editor.selection.insertHTML('<b id="date" class ="labels" title="Día que se envia el evento.">&lt;FECHA&gt;</b>&nbsp;');
                break;
              }
              case 'Facultad/Escuela': {
                editor.selection.insertHTML(
                  '<b id="school" class ="labels" title="Facultad de ingeniería, escuela de artes ...">&lt;FALCUTAD/ESCUELA&gt;</b>&nbsp;'
                );
                break;
              }
              case 'Estamento': {
                editor.selection.insertHTML(
                  '<b id= "bodyType" class ="labels" title="Estudiante, prodesor, auxiliar ...">&ltESTAMENTO&gt;</b>&nbsp;'
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
        imageUpload: {
          name: 'image',
          tooltip: 'Subir imagen de la plantilla prediseñada',
          exec: (async (editor) => {
            const imgCard = document.getElementById('templateCardImage');
            if (imgCard && this.joditEditor.editor.value !== '') {
              return await SwAlert.fire({
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
                  const srcRemove = imgCard.getAttributeNode('src').value;
                  //TODO: Eliminar imagen del servidor
                  imgCard.remove();
                  this.uploadImagesSvc.openExplorerWindows(editor);
                }
                return null;
              }).then(res => {
                console.log('Plantilla cargada!.', res);
                return null;
              });
            } else {
              await this.uploadImagesSvc.openExplorerWindows(editor);
            }
            this.cardTemplateImage = this.uploadImagesSvc.img;
          })
        },
        reset: {
          name: 'Reset',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" ' +
            'width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M14 ' +
            '12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2-9c-4.97 0-9 4.03-9 9H0l4 4 4-4' +
            'H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44C8.' +
            '04 20.3 9.94 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>',
          tooltip: 'Lleva el editor al estado inicial ...',
          exec: (editor) => {
            //TODO: Posicionar cursor al final del DOM
            editor.value = this.initialContent;
          }
        },
        theme: {
          name: 'Tema',
          icon: '<i class="material-icons">\n' +
            'new_label\n' +
            '</i>',
          tooltip: 'Cambiar tema del editor',
          exec: (editor, _, btn) => {
            console.log(btn);
          }
        },
        info: {
          name: 'info',
          // iconURL: 'C:/Users/Jaidiver/Desktop/Varios/TRABAJO/Onomástico/Onosmatic/src/assets/icons/account_balance-black-18dp.svg',
          popup: (editor) => {
            const text = editor.editor.innerText;
            const wordCount = text.split(/[\s\n\r\t]+/).filter((value) => value).length;
            const charCount = text.replace(/[\s\n\r\t\w]+/, '').length;
            console.log(editor.contentDocument.innerText.length);

            return '<div style="padding: 10px; color: lightgrey">' +
              'Words: ' + wordCount + '<br>' +
              'Chars: ' + charCount + '<br>' +
              '</div>';
          }
        }
      },
      events: {
        beforePaste: (pasteEvent) => {
          const item = pasteEvent.clipboardData;
          console.log(item);
          // if (item?.type.indexOf('image') === 0) {
          //   const blob = item.getAsFile();
          //
          //   const reader = new FileReader();
          //   reader.onload = (event) =>{
          //     console.log(event.target.result) ;
          //   };
          //
          //   reader.readAsDataURL(blob);
          // }
          return false;
        }
        // afterPaste:(event) => false,

      }
    };
  }

  async getFileFromUrl(url, name, defaultType = 'image/jpeg'){
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, {
      type: response.headers.get('content-type') || defaultType,
    });
  }

  ngOnInit() {
    this.setEditorConfig();
    this.themeSwitcherController.themeClass$
      .subscribe(
        (theme: string) => (this.config.theme = theme === 'light-theme' ? 'default' : 'dark')
      );
  };

  async ngAfterViewInit(){
    if (this.data?.card) {
      this.actionTODO = Action.edit;
      this.joditEditor.editor.value = this.data.card.texto;
      const imgCard = document.getElementById('templateCardImage');
      const srcImg = imgCard.getAttributeNode('src').value;
      this.cardTemplateImage = await
        this.getFileFromUrl(srcImg, 'image.jpg');
    } else {
      this.actionTODO = Action.new;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };
}

