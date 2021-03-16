import { Injectable } from '@angular/core';
import SwAlert from 'sweetalert2';
import { TemplateCardsService } from '@pages/¨publisher/services/template-cards.service';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  private imgFile: File = null;

  constructor(private templateCardsSvc: TemplateCardsService) {
  }

  get img() {
    return this.imgFile;
  }

  openExplorerWindows = (editor) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) {
        return;
      }
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        SwAlert.fire(
          {
            icon: 'warning',
            title: 'Oops...',
            text: 'La plantilla sólo puede tener formato, [jpg, png, jpeg, gif]!'
          }
        ).then(r => console.warn('Error en  el formato de la imagen!', r));
        return;
      }

      this.templateCardsSvc.imageUpload(file).subscribe(res => {
        if (res.fileDownloadUri) {
          this.insertImage(editor, res.fileDownloadUri);
          this.imgFile = file;
        }
      });
    };
  };

  insertImage = (editor, url) => {
    const image = document.createElement('img') as HTMLImageElement;
    image.src = url;
    image.id = 'templateCardImage';
    image.style.display = 'block';
    image.style.margin = 'auto';
    editor.selection.insertNode(image);
  };

}
