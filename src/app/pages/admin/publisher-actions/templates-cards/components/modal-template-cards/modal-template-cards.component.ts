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
import {TemplateCardsService} from '@pages/admin/publisher-actions/shared/services/template-cards.service';
import {JoditAngularComponent} from 'jodit-angular';
import {Subject} from 'rxjs';
import SwAlert from 'sweetalert2';
import {UploadImageService} from '@pages/admin/publisher-actions/shared/services/upload-image.service';
import {environment} from '@env/environment';
import {takeUntil} from 'rxjs/operators';
import {UnitsService} from '@adminShared/services/units.service';
import {TemplateCard} from '@adminShared/models/template-card.model';
import {ThemeSwitcherControllerService} from '@appShared/services/theme-switcher-controller.service';
import {ACTIONS, ByIdAndName, MEDIA, THEME} from '@adminShared/models/shared.model';
import {ResponsiveService} from '@appShared/services/responsive.service';
import {BaseFormTemplateCard} from '@adminShared/utils/base-form-template-card';

type SIZEiCONS = 'tiny' | 'xsmall' | 'small' | 'middle' | 'large';
type LABELS = 'nombre' | 'fecha' | 'facultad/escuela' | 'estamento' | 'programa';

interface Sizes {
  xs: SIZEiCONS;
  sm: SIZEiCONS;
  md: SIZEiCONS;
  lg: SIZEiCONS;
  xl: SIZEiCONS;
}

interface OptionGroupLabels {
  name: LABELS;
  date: LABELS;
  school: LABELS;
  bodyType: LABELS;
  program: LABELS;
}

@Component({
  selector: 'app-modal',
  templateUrl:'modal-template-cards.component.html',
  styleUrls: ['./modal-template-cards.component.scss']
})
export class ModalTemplateCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() media: MEDIA;
  @ViewChild('editor') joditEditor: JoditAngularComponent;

  actionTODO: ACTIONS = 'AGREGAR';
  administrativeUnits: ByIdAndName[];
  academicUnits: ByIdAndName[];
  config: any = {};

  private card: TemplateCard;
  private maxChars = 400;
  private uriCardImageEdit: string = null;
  private optionGroupLabels: OptionGroupLabels = {
    name: 'nombre',
    date: 'fecha',
    school: 'facultad/escuela',
    bodyType: 'estamento',
    program: 'programa'
  };
  private destroy$ = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalTemplateCardsComponent>,
    public responsiveSvc: ResponsiveService,
    private render2: Renderer2,
    public templateCardForm: BaseFormTemplateCard,
    private unitSvc: UnitsService,
    private elementRef: ElementRef,
    private themeSwitcherController: ThemeSwitcherControllerService,
    private templateCardsService: TemplateCardsService,
    private uploadImagesSvc: UploadImageService
  ) {
  }

  get onCompleteCard() {
    //TODO: Agregar más condiciones
    return !!this.imgCard && this.templateCardForm.baseForm.valid;
  }

  get imgCard() {
    return document.getElementById('templateCardImage') as HTMLImageElement;
  }


  setEditorConfig(themeEditor: string) {
    const iconSwitchTheme = `assets/icons/toggle-${themeEditor === 'dark' ? 'on' : 'off'}-solid.svg`;
    this.config = {
      toolbarButtonSize: 'middle' as SIZEiCONS,
      autofocus: true,
      enableDragAndDropFileToEditor: false,
      toolbarAdaptive: false,
      width: '100%',
      height: '100%',
      minHeight: '500px',
      language: 'es',
      enter: 'br',
      limitChars: this.maxChars,
      theme: themeEditor,
      placeholder:
        `
          Ingrese el texto aquí:<br><br>
          <hr><hr>
          <b>Nota importane</b>:<br>
          Tenga en cuenta que el texto debe contener <b>al menos una condición</b> y no puede superar los <b>${this.maxChars}</b></b>
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
          list: this.optionGroupLabels,
          exec: (editor, _, $btn) => {
            const {name, text} = $btn.control;
            if (text) {
              editor.selection.insertHTML(`<span id="${name}" class ="labels">&lt;${text}&gt;</span>&nbsp;`);
            }
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
        // keydown: (event) => {
        //   //TODO: Examinar generar bugs
        //   const { key } = event;
        //   if (key === 'Backspace' || key === 'Delete') {
        //     const selection: any = this.joditEditor.editor.ownerDocument.getSelection();
        //     const { id, className }: HTMLElement = selection.focusNode.parentElement;
        //     if (className === 'labels') {
        //       document.getElementById(id).remove();
        //     }
        //   }
        // },
        drop: (event) => {
          //TODO: Implementar la carga de imágenes desde el drop
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
      this.templateCardForm.baseForm.reset();
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
          this.saveTemplateCard();
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
      this.saveTemplateCard();
    }
  }

  saveTemplateCard() {
    this.templateCardForm.baseForm.patchValue({
      texto: this.joditEditor.editor.value.trim()
    });
    this.card = this.templateCardForm.baseForm.value;
    console.warn(this.card);
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
              const sizes: Sizes = {
                xs: 'tiny',
                sm: 'xsmall',
                md: 'xsmall',
                lg: 'middle',
                xl: 'large'
              };
              const toolbarButtonSize = sizes[media];
              //El if es para evitar que se llene el buffer.
              if (toolbarButtonSize !== this.config.toolbarButtonSize) {
                this.config = {
                  ...this.config,
                  toolbarButtonSize
                };
              }
            }
          );
      });

    this.unitSvc.getAcademicUnits()
      .pipe(takeUntil(this.destroy$))
      .subscribe((academicUnits) => {
        if (academicUnits) {
          this.academicUnits = academicUnits;
        }
      }, () => {
        SwAlert.showValidationMessage('Error cargando las unidades academicas para las plantillas.');
      });

    this.unitSvc.getAdministrativeUnits()
      .pipe(takeUntil(this.destroy$))
      .subscribe((administrativeUnits) => {
        if (administrativeUnits) {
          this.administrativeUnits = administrativeUnits;
        }
      }, () => SwAlert.showValidationMessage('Error obteniendo unidades administrativas'));
  };

  async ngAfterViewInit() {
    const {card} = this.data;
    if (card) {
      this.actionTODO = 'EDITAR';
      this.templateCardForm.baseForm.patchValue(card);
      this.joditEditor.editor.value = card.texto;
      //TODO: Verificar que la imagen si existe en db
      this.uriCardImageEdit = this.imgCard.getAttributeNode('src').value;
      const nameImage = this.uriCardImageEdit.replace(environment.downloadImagesUriServer + '/', '');
      this.uploadImagesSvc.getFileFromUrl(this.uriCardImageEdit, nameImage).then((file) => {
        this.uploadImagesSvc.img = file;
        this.uploadImagesSvc.imgURI = this.uriCardImageEdit;
      });
    } else {
      this.templateCardForm.baseForm.get('id').setValidators(null);
      this.templateCardForm.baseForm.get('id').updateValueAndValidity();
      this.actionTODO = 'AGREGAR';
    }
    this.templateCardForm.baseForm.get('unidadAcademicaPorPlantilla').setValidators(null);
    this.templateCardForm.baseForm.get('unidadAcademicaPorPlantilla').updateValueAndValidity();
    this.templateCardForm.baseForm.get('unidadAdministrativaPorPlantilla').setValidators(null);
    this.templateCardForm.baseForm.get('unidadAdministrativaPorPlantilla').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };

}

