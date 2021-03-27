import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateCardsService } from '@pages/¨publisher/services/template-cards.service';
import { ThemeSwitcherControllerService } from '@shared/services/theme-switcher-controller.service';
import { JoditAngularComponent } from 'jodit-angular';
import { Subject } from 'rxjs';
import { TemplateCard } from '@shared/models/template-card.model';
import SwAlert from 'sweetalert2';
import { UploadImageService } from '@pages/¨publisher/services/upload-image.service';
import { environment } from '@env/environment';
import { takeUntil } from 'rxjs/operators';
import { EmailUsersService } from '@pages/¨publisher/services/email-users.service';
import { LoaderService } from '@shared/services/loader.service';

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
  card: TemplateCard;
  cardImageEdit: File = null;
  urlImageEdit: string = null;
  maxChars = 400;
  actionTODO = '';
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
    private uploadImagesSvc: UploadImageService,
    private emailUserSvc: EmailUsersService,
    private loaderSvc: LoaderService
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
    if(!this.uploadImagesSvc?.img){
      this.getAssociations();
    }else{
      if(this.cardImageEdit){
        this.deleteImage(this.urlImageEdit);
      }
      this.uploadImagesSvc.imageUpload(this.uploadImagesSvc.img)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res?.fileDownloadUri) {
            const imgCard = document.getElementById('templateCardImage');
            imgCard.setAttribute('src', res.fileDownloadUri);
          }
          this.getAssociations();
        }, (err) => {
          SwAlert.fire({
            icon: 'error',
            html: `La imagen de la plantilla no se  guardó, por integridad de los datos no se creará la plantilla.`,
            title: 'Oops...',
            text: 'Algo salió mal!',
            footer: `<span style = 'color:red'>${err}</span>`
          }).then(r => {
            this.loaderSvc.setLoading(false);
            this.deleteImage();
            console.warn(`Error la plantilla no se pudo ${this.data?.card ? 'actualizar' : 'guardar'} la plantilla.`, r);
            console.table(this.card);
          });
        });
    }
  }

  getAssociations(){
    this.emailUserSvc.getAssociationsById()
      .pipe(takeUntil(this.destroy$))
      .subscribe(associations => {
        this.card = {
          id: this.data?.card?.id ? this.data.card.id : null,
          texto: this.joditEditor.editor.value,
          asociacionesPorPlantilla: associations
        };
        this.templateCardsService.newCardTemplate(
          this.card,
          this.uploadImagesSvc?.img? this.uploadImagesSvc.img : this.cardImageEdit)
          .pipe(takeUntil(this.destroy$))
          .subscribe((cardRes) => {
            if (cardRes) {
              SwAlert.fire(`Plantilla ${this.data?.card ? 'Actualizada!' : 'Guardada!'} `, '', 'success')
                .then(r => console.log(`Se ${this.data?.card ? 'actualizó' : 'guardó'} la plantilla exitosamente.`, r));
              this.onClose(true);
            }
          }, (err) => {
            SwAlert.fire({
              icon: 'error',
              html: `La plantilla no se  ${this.data?.card ? 'actualizó' : 'guardó'}`,
              title: 'Oops...',
              text: 'Algo salió mal!',
              footer: `<span style = 'color:red'>${err}</span>`
            }).then(r => {
              this.loaderSvc.setLoading(false);
              this.deleteImage();
              console.warn(`Error la plantilla no se pudo ${this.data?.card ? 'actualizar' : 'guardar'} la plantilla.`, r, this.card);
            });
          });
      });
    this.uploadImagesSvc.setImgNull();
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
          <img  src="assets/images/templateCard_example.jpg" style='display: block;
            margin: auto; width: 40vw' alt=''/>
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
          name: 'labels',
          iconURL:'/assets/icons/user-tag-solid.svg',
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
            if (imgCard) {
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
                console.log('Plantilla cargada!.', resultReplace);
                if (resultReplace.isConfirmed) {
                  imgCard.remove();
                  this.uploadImagesSvc.openExplorerWindows(editor);
                }
                return null;
              });
            } else {
              await this.uploadImagesSvc.openExplorerWindows(editor);
            }
          })
        },
        reset: {
          name: 'Reset',
          iconURL:'/assets/icons/sync-solid.svg',
          backgroundColor:'red',
          tooltip: 'Lleva el editor al estado inicial ...',
          exec: (editor) => {
            //TODO: Posicionar cursor al final del DOM
            editor.value = this.initialContent;
          }
        },
        theme: {
          name: 'Tema',
          iconURL:'/assets/icons/toggle-on-solid.svg',
          tooltip: 'Cambiar tema del editor',
          exec: (editor, _, btn) => {
            console.log(btn);
          }
        },
        info: {
          name: 'info',
          iconURL:'/assets/icons/info-circle-solid.svg',
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
          //TODO: Detectar si se pega una imagen para eliminar si ya habia una.
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

  deleteImage(url?: string) {
    const imgCard = document.getElementById('templateCardImage');
    let srcImg = imgCard.getAttributeNode('src').value;
    if(url){
      srcImg = url;
    }
    const imgName = srcImg.replace(environment.downloadImagesUriServer + '/', '');
    this.uploadImagesSvc.deleteImage(imgName)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log('Imagen eliminada! ', res);
      }, (err) => {
        this.loaderSvc.setLoading(false);
        console.log('Error al eliminar la imagen! :> ', err);
      });
  }

  ngOnInit() {
    this.setEditorConfig();
    this.themeSwitcherController.themeClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (theme: string) => (this.config.theme = theme === 'light-theme' ? 'default' : 'dark')
      );
  };

  async ngAfterViewInit() {
    if (this.data?.card) {
      this.actionTODO = Action.edit;
      this.joditEditor.editor.value = this.data.card.texto;
      this.urlImageEdit = document.getElementById('templateCardImage').getAttributeNode('src').value;
      this.uploadImagesSvc.getFileFromUrl(this.urlImageEdit,'img').then((file) => {
        this.cardImageEdit = file;
      });
    } else {
      this.actionTODO = Action.new;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  };


}

