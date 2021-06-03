import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TemplateCardsService} from '@pages/admin/publisher/shared/services/template-cards.service';
import {JoditAngularComponent} from 'jodit-angular';
import {Subject} from 'rxjs';
import SwAlert from 'sweetalert2';
import {UploadImageService} from '@pages/admin/publisher/shared/services/upload-image.service';
import {environment} from '@env/environment';
import {takeUntil} from 'rxjs/operators';
import {EmailUserService} from '@pages/admin/publisher/shared/services/email-user.service';
import {AssociationService} from '@pages/admin/shared/services/association.service';
import {TemplateCard} from '@adminShared/models/template-card.model';
import {ThemeSwitcherControllerService} from '@appShared/services/theme-switcher-controller.service';
import {ACTIONS, MEDIA, THEME} from '@adminShared/models/shared.model';
import {ResponsiveService} from '@appShared/services/responsive.service';

type SIZEiCONS = 'tiny' | 'xsmall' | 'small' | 'middle' | 'large';
type HEIGHT = '400px' | '500px' | '550px' | '600px' | '700px';

interface SIZES {
  xs: SIZEiCONS;
  sm: SIZEiCONS;
  md: SIZEiCONS;
  lg: SIZEiCONS;
  xl: SIZEiCONS;
}

interface HEIGHTS {
  xs: HEIGHT;
  sm: HEIGHT;
  md: HEIGHT;
  lg: HEIGHT;
  xl: HEIGHT;
}

@Component({
  selector: 'app-modal',
  template: `
    <div class="container">
      <div fxLayout="column" fxLayoutAlign="space-between stretch">
        <h1 mat-dialog-title>{{data.title | uppercase }}</h1>
        <jodit-editor #editor id="editor" [config]="config"></jodit-editor>
      </div>

      <div mat-dialog-actions fxLayout="row" fxLayoutAlign="end end">
        <button mat-raised-button fxFlex="20" color="warn" (click)="onClose(null)">Cancelar</button>
        <button mat-raised-button fxFlex="20" color="primary" (click)="onSave()"
                [disabled]="!onCompleteCard"
                [title]="onCompleteCard? 'Click para guardar':'Recuerde que debe ingresar la plantilla y almenos una condición'">
          {{actionTODO}}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./modal-template-cards.component.scss']
})
export class ModalTemplateCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() media: MEDIA;
  @ViewChild('editor') joditEditor: JoditAngularComponent;

  config: any;
  iconSwitchTheme: string;
  card: TemplateCard;
  maxChars = 400;
  actionTODO: ACTIONS = 'AGREGAR';
  uriCardImageEdit: string = null;
  private destroy$ = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalTemplateCardsComponent>,
    public responsiveSvc: ResponsiveService,
    private render2: Renderer2,
    private elementRef: ElementRef,
    private themeSwitcherController: ThemeSwitcherControllerService,
    private templateCardsService: TemplateCardsService,
    private uploadImagesSvc: UploadImageService,
    private emailUserSvc: EmailUserService,
    private associationSvc: AssociationService
  ) {
  }

  get onCompleteCard() {
    //TODO: Agregar más condiciones
    return !!this.imgCard;
  }

  get imgCard() {
    return document.getElementById('templateCardImage') as HTMLImageElement;
  }


  setEditorConfig(themeEditor: string) {
    const iconSwitchTheme = `assets/icons/toggle-${themeEditor === 'dark' ? 'on' : 'off'}-solid.svg`;
    this.config = {
      autofocus: true,
      enableDragAndDropFileToEditor: false,
      toolbarAdaptive: false,
      width: '100%',
      height: '100%',
      language: 'es',
      enter: 'br',
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
          Hola <b>&lt;NOMBRE&gt;</b> en ésta
          <b>&lt;FECHA&gt;</b>, la
          <b>&lt;FALCUTAD/ESCUELA&gt;</b>
          de la Universidad de Antioquia le queremos desear un feliz cumpleaños 🥳, tu cómo parte del grupo de
          <b>&ltESTAMENTO&gt;</b>, eres muy importante
          para nosotros.
          </span><br>
          <img  src="assets/images/templateCard_example.jpg" style="display: block;
            margin: auto; width: 35vw" alt="template card example"/>
        `,
      showXPathInStatusbar: true,
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
        'undo', 'redo', 'reset', 'preview', 'fullsize', '|', 'theme', 'info', 'about'
      ],
      controls: {
        copyTrash: {
          name: 'copy',
          tooltip: 'Copiar a la papelera',
          exec: (editor) => {
            editor.execCommand('selectall');
            editor.execCommand('copy');
            SwAlert.fire('Texto quedó copiado en el clipboard', '', 'success').then();
          }
        },
        labels: {
          name: 'labels',
          iconURL: 'assets/icons/user-tag-solid.svg',
          tooltip: 'Etiquetas para filtrar información del destinatarios',
          list: {
            name: 'Nombre',
            date: 'Fecha',
            school: 'Facultad/Escuela',
            bodyType: 'Estamento',
            program: 'Programa acádemico'
          },
          exec: (editor, _, $btn) => {
            const key = $btn.control.text;
            switch (key) {

              case 'Nombre': {
                editor.selection.insertHTML(
                  '<span id="name" class ="labels">&lt;NOMBRE&gt;</span>&nbsp;'
                );
                break;
              }
              case 'Fecha': {
                editor.selection.insertHTML(
                  '<span id="date" class ="labels">&lt;FECHA&gt;</span>&nbsp;'
                );
                break;
              }
              case 'Facultad/Escuela': {
                editor.selection.insertHTML(
                  '<span id="school" class ="labels">' +
                  '&lt;FALCUTAD/ESCUELA&gt;</span>&nbsp;'
                );
                break;
              }
              case 'Estamento': {
                editor.selection.insertHTML(
                  '<span id= "bodyType" class ="labels">&ltESTAMENTO&gt;</span>&nbsp;'
                );
                break;
              }
              case 'Programa acádemico': {
                editor.selection.insertHTML(
                  '<span id= "academicProgram" class ="labels">&ltPROGRAMA&gt;</span>&nbsp;'
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
            if (this.imgCard) {
              return await SwAlert.fire({
                title: 'Sólo puede cargarse una plantilla!',
                text: ' Desea reemplazar la plantilla actual?',
                icon: 'warning',
                footer: `
                    <span style="color:darkorange">
                        Si reemplaza la plantilla, la anterior se eliminará  de la base de datos y no podrá revertirse!
                    </span>`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, reemplazarla!',
                cancelButtonText: 'Cancelar'
              }).then((resultReplace) => {
                if (resultReplace.isConfirmed) {
                  this.uploadImagesSvc.loadImage(editor);
                }
                return null;
              });
            } else {
              this.uploadImagesSvc.loadImage(editor);
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
          //TODO: Examinar generar bugs
          // const { key } = event;
          // if (key === 'Backspace' || key === 'Delete') {
          //   const selection: any = this.joditEditor.editor.ownerDocument.getSelection();
          //   const { id, className }: HTMLElement = selection.focusNode.parentElement;
          //   if (className === 'labels') {
          //     document.getElementById(id).remove();
          //   }
          // }
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
    if (this.uploadImagesSvc.imgURI?.includes('blob')) {
      this.uploadImagesSvc.imageUpload()
        .pipe(takeUntil(this.destroy$))
        .subscribe(img => {
          if (img?.fileDownloadUri) {
            this.imgCard.setAttribute('src', img.fileDownloadUri);
            //TODO: Pedir al back debe devolver el archivo
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
                <span style="color: red;">
                    Error ${err.status}! <b> ${err.status === 403 ? 'Necesita permisos de admin.' : err.error?.error}</b>
                    ${err.status === 401 ? 'Por seguridad se cerrará la sesión.' : ''}
                </span>
                <span>&nbsp;&nbsp;Necesitas <a href="">ayuda</a>?</span>.`
          }).then();
        });
    } else {
      this.getAssociations();
    }
  }

  getAssociations() {
    //TODO: Se actualiza con los actuales asociciones del publicador, reemplazando lo permisos iniciales del publicador.
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
              if (this.uriCardImageEdit && this.uriCardImageEdit !== this.uploadImagesSvc.imgURI) {
                this.uploadImagesSvc.onDeleteImage(this.uriCardImageEdit);
              } else if (this.actionTODO === 'EDITAR') {
                SwAlert.showValidationMessage('La imagen de la plantilla no se cambió');
              }
              this.onClose(true);
            }
          }, (err) => {
            SwAlert.fire({
              icon: 'error',
              title: 'Algo salió mal!',
              html: `La plantilla no se  ${this.data?.card ? 'actualizó' : 'guardó'}`,
              footer: `
                <span style="color: red;">
                    Error ${err.status}! <b> ${err.status === 403 ? 'Necesita permisos de admin.' : err.error?.error}</b>
                    ${err.status === 401 ? 'Por seguridad se cerrará la sesión.' : ''}
                </span>
                <span>&nbsp;&nbsp;Necesitas <a href="">ayuda</a>?</span>.`
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
      .subscribe((theme: THEME) => {
        const themeEditor = theme === 'light-theme' ? 'default' : 'dark';
        this.setEditorConfig(themeEditor);
        this.responsiveSvc.screenWidth$
          .pipe(takeUntil(this.destroy$))
          .subscribe((media) => {
              const sizes: SIZES = {
                xs: 'tiny',
                sm: 'xsmall',
                md: 'xsmall',
                lg: 'middle',
                xl: 'large'
              };
              const heights: HEIGHTS = {
                xs: '400px',
                sm: '500px',
                md: '550px',
                lg: '600px',
                xl: '700px'
              };
              const toolbarButtonSize = sizes[media];
              const minHeight = heights[media];
              this.config = {
                ...this.config,
                toolbarButtonSize,
                minHeight
              };
            }
          );
      });
  };

  async ngAfterViewInit() {
    if (this.data?.card) {
      this.actionTODO = 'EDITAR';
      this.joditEditor.editor.value = this.data.card.texto;
      //TODO: Verificar que la imagen si existe en db
      this.uriCardImageEdit = this.imgCard.getAttributeNode('src').value;
      const nameImage = this.uriCardImageEdit.replace(environment.downloadImagesUriServer + '/', '');
      this.uploadImagesSvc.getFileFromUrl(this.uriCardImageEdit, nameImage).then((file) => {
        this.uploadImagesSvc.img = file;
        this.uploadImagesSvc.imgURI = this.uriCardImageEdit;
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

