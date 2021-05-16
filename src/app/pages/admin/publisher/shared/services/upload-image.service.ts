import { Injectable } from '@angular/core';
import SwAlert from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ImageUpload } from '@adminShared/models/image-upload.model';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FriendlyNumberAbbreviationService } from '@appShared/services/friendly-number-abbreviation.service';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  public imgURI: string;
  private imgFile: File = null;
  private imgGenericName: '_template';

  constructor(
    private http: HttpClient,
    private imageCompress: NgxImageCompressService,
    private friendlyNumberSvc: FriendlyNumberAbbreviationService
  ) {
  }

  get img() {
    return this.imgFile;
  }

  set img(file: File) {
    this.imgFile = file;
  }

  loadImage(editor, onDeleteLastImage: boolean) {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      const fileType = image.substring('data:image/'.length, image.indexOf(';base64'));
      if (!fileType.match(/(jpg|jpeg|png|gif)$/)) {
        SwAlert.fire(
          {
            icon: 'warning',
            title: 'Oops...',
            text: 'La plantilla sólo puede tener formato, [jpg, png, jpeg, gif]!'
          }
        ).then();
        return;
      }

      const fileSize = this.imageCompress.byteCount(image);
      const maxSize = 300 * 1024;
      const lowerQuality = fileSize > maxSize ? (fileSize / maxSize - 1) * 100 : fileSize * 90;
      const quality = lowerQuality / fileSize;

      this.imageCompress.compressFile(image, orientation, 75, quality).then((imageCompressed) => {
        const fileSizeLowered = this.imageCompress.byteCount(imageCompressed);
        SwAlert.fire(
          'Carga exitosa!',
          `La plantilla se ha cargado (${this.getFileSizeFriendlyFormat(fileSizeLowered)})`,
          'success').then(() => {
          this.getFileFromUrl(imageCompressed, 'img').then((file) => {
            if (file) {
              this.imgFile = file;
              this.imgURI = URL.createObjectURL(this.imgFile);
              this.insertImage(editor);
            }
          }, () => {
            SwAlert.fire('Compresion fallida!', 'Error comprimiendo la imagén', 'error').then();
          });
        });
        if (onDeleteLastImage) {
          this.onDeleteImage();
        }
      }, () => {
        SwAlert.fire('Compresion fallida!', 'Error comprimiendo la imagén', 'error').then();
      });
    }, () => {
      SwAlert.fire('Carga fallida!', 'La plantilla no se cargó', 'warning').then();
    });

  }

  getFileSizeFriendlyFormat(fileSize: number): string {
    return `${this.friendlyNumberSvc.getFriendlyFormat(fileSize)}B`;
  }

  imageUpload(): Observable<ImageUpload> {
    if (this.imgFile) {
      const formData = new FormData();
      formData.append('file', this.imgFile);
      return this.http
        .post<ImageUpload>(`${environment.uploadImagesUriServer}/${new Date().getTime()}${this.imgGenericName}`, formData, {
          reportProgress: true
        });
    }
    return of(null);
  }

  imageDownload(imgName?: string): Observable<File> {
    return this.http.get<File>(`${environment.downloadImagesUriServer}/${imgName ? imgName : this.imgURI}`);
  }

  async getFileFromUrl(url, name, defaultType = 'image/jpeg'): Promise<File> {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, {
      type: response.headers.get('content-type') || defaultType
    });
  }

  insertImage = (editor) => {
    const image = document.createElement('img') as HTMLImageElement;
    image.src = this.imgURI;
    image.id = 'templateCardImage';
    image.alt='template-card';
    image.setAttribute('style', `
      display: block !important;
      margin:auto !important;
      width:100% important;
      max-width:80% !important;
      height: auto !important;
      max-height:100% !important;
      object-fit: cover !important;
      object-position: center center !important;
    `);
    editor.selection.insertNode(image);
  };

  onDeleteImage() {
    this.deleteImage()
      .subscribe(() => {
        SwAlert.showValidationMessage('La anterior imagen de la plantilla fue eliminada correctamente');
        document?.getElementById('templateCardImage').remove();
      }, () => {
        //TODO: Hacer log de error
        if (this.isImgStorage()) {
          SwAlert.showValidationMessage('Error al eliminar la anterior imagen, carge de nuevo la plantilla');
          this.imgFile = null;
          document?.getElementById('templateCardImage').remove();
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

  isImgStorage(): boolean {
    //TODO: Poco seguro, hacer peticion para saber si la imagen en realidad está en la base de datos
    return this.imgFile.name.includes(this.imgGenericName);
  }
}
