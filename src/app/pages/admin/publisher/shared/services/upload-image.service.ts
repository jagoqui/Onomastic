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

  loadImage(editor) {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      const htmlImg: HTMLImageElement = new Image();
      htmlImg.src = image;

      htmlImg.onload = () => {
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

        const width = htmlImg.width;
        const maxWidth = 600;
        const ratio = (width > maxWidth) ? 1 / (width / maxWidth) * 100 : 100;
        const size = this.imageCompress.byteCount(image);
        const maxSize = 150 * 1024;
        const quality = size > maxSize ? 1 / (size / maxSize) * 100 : 100;

        this.imageCompress.compressFile(image, orientation, ratio, quality).then((imageCompressed) => {
          const fileSizeLowered = this.imageCompress.byteCount(imageCompressed);
          htmlImg.src = imageCompressed;

          htmlImg.onload = () => {
            SwAlert.fire(
              'Carga exitosa!',
              `La plantilla se ha cargado (${this.getFileSizeFriendlyFormat(fileSizeLowered)}) ${htmlImg.width + 'x' + htmlImg.height}`,
              'success').then(() => {
              this.getFileFromUrl(imageCompressed, 'img').then((file) => {
                if (file) {
                  this.imgFile = file;
                  this.imgURI = URL.createObjectURL(this.imgFile);
                  this.insertImage(editor);
                }
              }, () => {
                SwAlert.fire('Compresion fallida!', 'Error comprimiendo la imagen', 'error').then();
              });
            });
            document.getElementById('templateCardImage')?.remove();
          };
        }, () => {
          SwAlert.fire('Compresion fallida!', 'Error comprimiendo la imagen', 'error').then();
        });
      };

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
        .post<ImageUpload>(`${environment.uploadImagesUriServer}/${new Date().getTime()}${this.imgFile.name}`, formData);
    }
    return of(null);
  }

  imageDownload(imgUriEdit?: string): Observable<File> {
    console.log(imgUriEdit ? imgUriEdit : this.imgURI);
    return this.http.get<File>(`${imgUriEdit ? imgUriEdit : this.imgURI}`);
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
    image.alt = 'template-card';
    image.setAttribute('style', `
      background-color: green !important;
      display: block !important;
      margin:auto !important;
      width:100% !important;
      max-width:90% !important;
      height: auto !important;
      max-height:40vw !important;
      object-fit: cover !important;
      object-position: center center !important;
    `);
    editor.selection.insertNode(image);
  };

  onDeleteImage(imgUriEdit?: string) {
    if(!imgUriEdit && this.imgURI?.includes('blob')){
      document.getElementById('templateCardImage')?.remove();
      return;
    }
    this.deleteImage(imgUriEdit?.replace(environment.downloadImagesUriServer + '/', ''))
      .subscribe(() => {
        SwAlert.showValidationMessage('La anterior imagen de la plantilla fue eliminada correctamente');
        document.getElementById('templateCardImage')?.remove();
      }, () => {
        SwAlert.showValidationMessage('Error al eliminar la anterior imagen, ya no se encuentra alamacenda en la base de datos.');
        this.imgFile = null;
      });
  }

  deleteImage(imgName?: string): Observable<any> {
    return this.http
      .delete<any>(`${environment.apiUrl}/delete/${imgName ? imgName : this.imgFile.name}`);
  }
}
