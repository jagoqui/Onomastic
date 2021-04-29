import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateCardsService } from '@pages/admin/publisher/shared/services/template-cards.service';
import { JoditAngularComponent } from 'jodit-angular';
import { Subject } from 'rxjs';
import SwAlert from 'sweetalert2';
import { UploadImageService } from '@pages/admin/publisher/shared/services/upload-image.service';
import { environment } from '@env/environment';
import { takeUntil } from 'rxjs/operators';
import { EmailUserService } from '@pages/admin/publisher/shared/services/email-user.service';
import { AssociationService } from '@pages/admin/shared/services/association.service';
import { TemplateCard } from '@adminShared/models/template-card.model';
import { ThemeSwitcherControllerService } from '@appShared/services/theme-switcher-controller.service';
import { ACTIONS } from '@adminShared/models/shared.model';


@Component({
  selector: 'app-modal',
  templateUrl: './modal-template-cards.component.html',
  styleUrls: ['./modal-template-cards.component.scss']
})
export class ModalTemplateCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editor') joditEditor: JoditAngularComponent;

  jodit: JoditAngularComponent;
  config: any;
  iconSwitchTheme: string;
  card: TemplateCard;
  maxChars = 400;
  actionTODO: ACTIONS;
  cardImageStyles = `
    <style>
        #templateCardImage{
                display: block;
                margin: auto;
                width:50vw;
                max-width: 85%!important;
                height: auto;
        }
        @supports(object-fit: cover){
                #templateCardImage{
                        height: 100%!important;
                        object-fit: cover!important;
                        object-position: center center!important;
                }
        }
    </style>
  `;
  private destroy$ = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<ModalTemplateCardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private themeSwitcherController: ThemeSwitcherControllerService,
    private templateCardsService: TemplateCardsService,
    private uploadImagesSvc: UploadImageService,
    private emailUserSvc: EmailUserService,
    private associationSvc: AssociationService
  ) {
  }

  get onCompleteCard() {
    //TODO: Agregar más condiciones
    const cardImg = document.getElementById('templateCardImage');
    return !!cardImg;
  }

  setEditorConfig(themeEditor: string) {
    const iconSwitchTheme = `assets/icons/toggle-${themeEditor === 'dark' ? 'on' : 'off'}-solid.svg`;
    this.config = {
      autofocus: true,
      minHeight: 600,
      language: 'es',
      enter: 'br',
      toolbarButtonSize: 'large',
      limitChars: this.maxChars,
      theme: themeEditor,
      placeholder:
        `
          Ingrese el texto aquí:<br><br>
          <hr><hr>
          <b>Nota importane</b>:<br>
          Recuerde que el texto debe contener <b>al menos una condición</b> y no puede superar los <b>${this.maxChars}</b></b>
          caracteres,además recuerde que, debe subir una imagen con la plantilla que cumpla con el siguiente formato
          <b>['image/jpg', 'image/png', 'image/jpeg', 'image/gif']</b>.<br>
          Ejemplo:<br><br>
           <span>
          Hola <b id='name' class='labels' title='Nombre del usuario de correo.'>&lt;NOMBRE&gt;</b> en ésta
          <b id='date' class='labels' title='Día que se envia el evento.'>&lt;FECHA&gt;</b>, la
          <b id='school' class='labels' title='Facultad de ingeniería, escuela de artes ...'>&lt;FALCUTAD/ESCUELA&gt;</b>
          de la Universidad de Antioquia le queremos desear un feliz cumpleaños 🥳, tu cómo parte del grupo de
          <b id='bodyType' class='labels' title='Estudiante, prodesor, auxiliar ...'>&ltESTAMENTO&gt;</b>, eres muy importante
          para nosotros.
          </span><br>
          <img  src='assets/images/templateCard_example.jpg' style='display: block;
            margin: auto; width: 40vw' alt=''/>
        `,
      showXPathInStatusbar: true,
      toolbarAdaptive: false,
      insertImageAsBase64URI: false,
      buttons: [
        'source',
        'font', 'paragraph', 'fontsize', 'brush', '|',
        'bold', 'underline', 'italic', 'strikethrough', '|',
        'align', 'indent', 'outdent', '|',
        'ol', 'ul', '|',
        'table', 'hr', '|',
        'superscript', 'subscript', 'symbol', '|',
        'eraser', 'selectall', 'copyTrash', '|', 'imageUpload', 'print', '|', 'labels', '|',
        '\n',
        'undo', 'redo', 'reset', 'preview', 'fullsize', '|', 'theme', 'info', 'about'
      ],
      controls: {
        copyTrash: {
          name: 'copy',
          tooltip: 'Copiar a la papelera',
          exec: (editor) => {
            editor.execCommand('selectall');
            editor.execCommand('copy');
            SwAlert.fire('Texto quedó copiado en el clipboard', '', 'success').then(_ => {
            });
          }
        },
        labels: {
          name: 'labels',
          iconURL: 'assets/icons/user-tag-solid.svg',
          tooltip: 'Etiquetas para automatizar la plantilla',
          list: {
            name: 'Nombre',
            date: 'Fecha',
            school: 'Facultad/Escuela',
            bodyType: 'Estamento',
            program: 'Programa acádemico'
          },
          exec: (editor, _, $btn) => {
            if (this.joditEditor.editor.value === '') {
              this.joditEditor.editor.value = this.cardImageStyles;
            }
            const key = $btn.control.text;
            switch (key) {
              case 'Nombre': {
                editor.selection.insertHTML(
                  '<span id="name" class ="labels" title="Nombre del usuario de correo.">&lt;NOMBRE&gt;</span>&nbsp;'
                );
                break;
              }
              case 'Fecha': {
                editor.selection.insertHTML(
                  '<span id="date" class ="labels" title="Día que se envia el evento.">&lt;FECHA&gt;</span>&nbsp;'
                );
                break;
              }
              case 'Facultad/Escuela': {
                editor.selection.insertHTML(
                  '<span id="school" class ="labels" title="Facultad de ingeniería, escuela de artes ...">' +
                  '&lt;FALCUTAD/ESCUELA&gt;</span>&nbsp;'
                );
                break;
              }
              case 'Estamento': {
                editor.selection.insertHTML(
                  '<span id= "bodyType" class ="labels" title="Estudiante, prodesor, auxiliar ...">&ltESTAMENTO&gt;</span>&nbsp;'
                );
                break;
              }
              case 'Programa acádemico': {
                editor.selection.insertHTML(
                  '<span id= "academicProgram" class ="labels" title="Programa acádemico ...">&ltPROGRAMA&gt;</span>&nbsp;'
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
            if (this.joditEditor.editor.value === '') {
              this.joditEditor.editor.value = this.cardImageStyles;
            }
            const imgContainer = document.getElementById('imgContainer');
            if (imgContainer) {
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
                  this.uploadImagesSvc.openExplorerWindows(editor, true);
                }
                return null;
              });
            } else {
              await this.uploadImagesSvc.openExplorerWindows(editor, false);
            }
          })
        },
        reset: {
          name: 'Reset',
          iconURL: 'assets/icons/sync-solid.svg',
          backgroundColor: 'red',
          tooltip: 'Lleva el editor al estado inicial ...',
          exec: (editor) => {
            editor.value = '';
          }
        },
        theme: {
          name: 'Tema',
          iconURL: iconSwitchTheme,
          tooltip: 'Doble click para cambiar de tema',
          value: 'default',
          exec: (editor, _, btn) => {
            console.log(btn);
            //Todo: Cambiar el tema al editor
          }
        },
        info: {
          name: 'info',
          iconURL: 'assets/icons/info-circle-solid.svg',
          popup: (editor) => {
            const text = editor.editor.innerText;
            const wordCount = text.split(/[\s\n\r\t]+/).filter((value) => value).length;
            const charCount = text.replace(/[\s\n\r\t]+/, '').length;

            return '<div style="padding: 10px; color: lightgrey">' +
              'Words: ' + wordCount + '<br>' +
              'Chars: ' + charCount + '<br>' +
              '</div>';
          }
        }
      },
      events: {
        keypress: () => {
          if (this.joditEditor.editor.value === '') {
            this.joditEditor.editor.selection.insertHTML(this.cardImageStyles);
          }
          const text = this.joditEditor.editor.editor.innerText;
          //Todo: No coincide con el contador por defecto del editor
          const charCount = text.replace(/[\s\n\r\t]+/, '').length;
          if (charCount >= this.maxChars) {
            return SwAlert.fire({
              title: `No puede agregar más texto!`,
              html: `Sobrepasó  los <br>${this.maxChars}</b> de máximo de caracteres permitidos.`,
              icon: 'warning'
            }).then(_ => false);
          }
        },
        keydown: (event) => {
          const { key } = event;
          if (key === 'Backspace' || key === 'Delete') {
            const selection: any = this.joditEditor.editor.ownerDocument.getSelection();
            const { id, className }: HTMLElement = selection.focusNode.parentElement;
            if (className === 'labels') {
              document.getElementById(id).remove();
            }
          }
        },
        beforePaste: (event) => {
          if (event.clipboardData.types.length === 0) {
            SwAlert.fire('No puedes cargar la plantilla de esta forma, utiliza la herramienta de cargar imágenes!', '', 'error').then();
            return false;
          }
        },
        drop: (event) => {
          SwAlert.fire('No puedes cargar la plantilla de esta forma, utiliza la herramienta de cargar imágenes!', '', 'error').then();
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };
  }

  onClose(close?: boolean): void {
    if (close ? close : confirm('No ha guardado los cambios, desea salir?')) {
      this.joditEditor.resetEditor();
      this.dialogRef.close();
    }
  }

  onSave() {
    if (this.uploadImagesSvc.isImgStorage()) {
      console.log('entra');
      //TODO: Si hay error en la actulización de la plantilla está eliminado la imagen
      this.getAssociations();
    } else {
      this.uploadImagesSvc.imageUpload()
        .pipe(takeUntil(this.destroy$))
        .subscribe(img => {
          if (img?.fileDownloadUri) {
            const imgCard = document.getElementById('templateCardImage');
            imgCard.setAttribute('src', img.fileDownloadUri);
            //TODO: Acá el back debe devolver el archivo
            this.uploadImagesSvc.getFileFromUrl(img?.fileDownloadUri, img.fileName).then((file) => {
              this.uploadImagesSvc.img = file;
              this.uploadImagesSvc.imgURI = img.fileDownloadUri;
            });
          }
          this.getAssociations();
        }, (err) => {
          SwAlert.fire({
            icon: 'error',
            title: 'Algo salió mal!',
            html: `
              La imagen de la plantilla no se  guardó, por integridad de los datos no se
              ${this.data?.card ? 'actualizará' : 'creará'} la plantilla.`,
            footer: `
                <span style='color: red;'>
                    Error ${err.status}! <b> ${err.status === 403 ? 'Necesita permisos de admin.' : err.error?.error}</b>
                    ${err.status === 401 ? 'Por seguridad se cerrará la sesión.' : ''}
                </span>
                <span>&nbsp;&nbsp;Necesitas <a href=''>ayuda</a>?</span>.`
          });
        });
    }
  }

  getAssociations() {
    this.associationSvc.getAssociationsByPublisher()
      .pipe(takeUntil(this.destroy$))
      .subscribe(associations => {
        this.card = {
          id: this.data?.card?.id ? this.data.card.id : null,
          texto: this.joditEditor.editor.value,
          asociacionesPorPlantilla: associations
        };
        this.templateCardsService.saveTemplateCard(this.card)
          .pipe(takeUntil(this.destroy$))
          .subscribe((cardRes) => {
            if (cardRes) {
              SwAlert.fire(`Plantilla ${this.data?.card ? 'Actualizada!' : 'Guardada!'} `, '', 'success').then();
              this.onClose(true);
            }
          }, (err) => {
            SwAlert.fire({
              icon: 'error',
              title: 'Algo salió mal!',
              html: `La plantilla no se  ${this.data?.card ? 'actualizó' : 'guardó'}`,
              footer: `
                <span style='color: red;'>
                    Error ${err.status}! <b> ${err.status === 403 ? 'Necesita permisos de admin.' : err.error?.error}</b>
                    ${err.status === 401 ? 'Por seguridad se cerrará la sesión.' : ''}
                </span>
                <span>&nbsp;&nbsp;Necesitas <a href=''>ayuda</a>?</span>.`
            }).then(() => {
              if (this.actionTODO === 'AGREGAR') {
                this.uploadImagesSvc.onDeleteImage();
              }
            });
          });
      }, () => SwAlert.showValidationMessage('Error cargando asociaciones'));
    this.uploadImagesSvc.img = null;
  }

  ngOnInit() {
    this.themeSwitcherController.themeClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme: string) => {
        const themeEditor = theme === 'light-theme' ? 'default' : 'dark';
        this.setEditorConfig(themeEditor);
      });
  };

  async ngAfterViewInit() {
    if (this.data?.card) {
      this.actionTODO = 'EDITAR';
      this.joditEditor.editor.value = this.data.card.texto;
      const urlImageEdit = document.getElementById('templateCardImage').getAttributeNode('src').value;
      const nameImage = urlImageEdit.replace(environment.downloadImagesUriServer + '/', '');
      this.uploadImagesSvc.getFileFromUrl(urlImageEdit, nameImage).then((file) => {
        this.uploadImagesSvc.img = file;
        this.uploadImagesSvc.imgURI = urlImageEdit;
      });
    } else {
      this.actionTODO = 'AGREGAR';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };

}

