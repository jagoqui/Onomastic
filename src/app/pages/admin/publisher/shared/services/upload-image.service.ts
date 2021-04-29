import { Injectable } from '@angular/core';
import SwAlert from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ImageUpload } from '@adminShared/models/image-upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  public imgURI: string;
  private imgFile: File = null;
  private imgGerenicName: '_template';

  constructor(
    private http: HttpClient
  ) {
  }

  get img() {
    return this.imgFile;
  }

  set img(file: File) {
    this.imgFile = file;
  }

  openExplorerWindows = (editor, onDeleteLastImage) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    return input.onchange = () => {
      const file = input.files[0];
      if (!file) {
        SwAlert.fire('Carga fallida!', 'La plantilla no se cargó', 'warning').then();
        return;
      }
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        SwAlert.fire(
          {
            icon: 'warning',
            title: 'Oops...',
            text: 'La plantilla sólo puede tener formato, [jpg, png, jpeg, gif]!'
          }
        ).then();
        return;
      }
      SwAlert.fire('Carga exitosa!', 'La plantilla se ha cargado', 'success').then(() => {
        this.imgFile = file;
        this.imgURI = URL.createObjectURL(file);
        this.insertImage(editor);
      });
      if (onDeleteLastImage) {
        this.onDeleteImage();
      }
    };
  };

  imageUpload(): Observable<ImageUpload> {
    if (this.imgFile) {
      const formData = new FormData();
      formData.append('file', this.imgFile);
      return this.http
        .post<ImageUpload>(`${environment.uploadImagesUriServer}/${new Date().getTime()}${this.imgGerenicName}`, formData, {
          reportProgress: true
        });
    }
    return of(null);
  }

  imageDownload(imgName?: string): Observable<File> {
    return this.http.get<File>(`${environment.downloadImagesUriServer}/${imgName ? imgName : this.imgURI}`);
  }

  isImgStorage(): boolean {
    return this.imgFile.name.includes(this.imgGerenicName);
  }

  async getFileFromUrl(url, name, defaultType = 'image/jpeg'): Promise<File> {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, {
      type: response.headers.get('content-type') || defaultType
    });
  }

  insertImage = (editor) => {
    const imgContainer = document.createElement('div') as HTMLImageElement;
    const image = document.createElement('img') as HTMLImageElement;
    image.src = this.imgURI;
    image.id = 'templateCardImage';
    imgContainer.appendChild(image);
    imgContainer.id = 'imgContainer';
    editor.selection.insertNode(imgContainer);
  };

  onDeleteImage() {
    this.deleteImage()
      .subscribe(() => {
        SwAlert.showValidationMessage('La anterior imagen de la plantilla fue eliminada correctamente');
        document?.getElementById('imgContainer').remove();
      }, () => {
        //TODO: Hacer log de error
        if (this.isImgStorage()) {
          SwAlert.showValidationMessage('Error al eliminar la imagen');
        } else {
          SwAlert.showValidationMessage('Error al eliminar la imagen');
        }
      });
  }

  deleteImage(): Observable<any> {
    if (this.isImgStorage()) {
      return this.http
        .delete<any>(`${environment.apiUrl}/delete/${this.imgFile.name}`);
    }
    return of(null);
  }
}
