import { Injectable } from '@angular/core';
import SwAlert from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { ImageUpload } from '@shared/models/image-upload.model';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  private imgFile: File = null;

  constructor(
    private http: HttpClient
  ) {
  }

  get img() {
    return this.imgFile;
  }

  setImgNull() {
    this.imgFile = null;
  }

  openExplorerWindows = (editor) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    return input.onchange = async () => {
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
      this.imgFile = file;
      this.insertImage(editor, URL.createObjectURL(file));
    };
  };

  imageUpload(img: File): Observable<ImageUpload> {
    if (img) {
      const formData = new FormData();
      formData.append('file', img);
      return this.http
        .post<ImageUpload>(`${environment.uploadImagesUriServer}/${new Date().getTime()}_${img.name}`, formData, {
          reportProgress: true
        });
    }
    return of(null);
  }

  async getFileFromUrl(url, name, defaultType = 'image/jpeg'): Promise<File> {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, {
      type: response.headers.get('content-type') || defaultType
    });
  }

  insertImage = (editor, url) => {
    const image = document.createElement('img') as HTMLImageElement;
    image.src = url;
    image.id = 'templateCardImage';
    editor.selection.insertNode(image);
  };

  deleteImage(imgName: string): Observable<any> {
    return this.http
      .delete<any>(`${environment.apiUrl}/delete/${imgName}`);
  }
}
