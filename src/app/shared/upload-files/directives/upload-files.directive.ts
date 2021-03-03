import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import SwAlert from 'sweetalert2';

import {ImageValidator} from '../helpers/image-validators';
import {FileUpload} from '../models/file-upload';


@Directive({
  selector: '[appUploadFiles]'
})
export class UploadFilesDirective extends ImageValidator {

  @Input() files: FileUpload[] = [];
  @Input() multiple = false;
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter();
  @Output() fileSrc: EventEmitter<string | ArrayBuffer | null> = new EventEmitter();

  constructor() {
    super();
  }

  private static getDataTransfer(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private static avoidOpeningBrowser(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  public getFileSrc(file: any) {
    const reader = new FileReader();
    reader.onload = () => this.fileSrc.emit(reader.result);
    reader.readAsDataURL(file);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('dragover', ['$event'])
  private onDragEnter(event: Event) {
    UploadFilesDirective.avoidOpeningBrowser(event);
    this.mouseOver.emit(true);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('dragleave', ['$event'])
  private onDragLeave() {
    this.mouseOver.emit(false);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('drop', ['$event'])
  private onDrop(event: any) {
    const dataTransfer = UploadFilesDirective.getDataTransfer(event);
    if (!dataTransfer) {
      return;
    }
    UploadFilesDirective.avoidOpeningBrowser(event);
    this.extractFiles(event, dataTransfer.files);
    this.mouseOver.emit(false);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('change', ['$event'])
  private extractFiles(event: any, fileList?: FileList): void {
    const filesListAux = fileList ? fileList : event.target.files;
    for (const property of Object.getOwnPropertyNames(filesListAux)) {
      const tempFile = filesListAux[property];
      if (this.canBeUploaded(tempFile)) {
        const newFile = new FileUpload(tempFile);
        this.files.push(newFile);
        this.getFileSrc(tempFile);
      }
    }
  }

  private canBeUploaded(file: File): boolean {
    if (!this.checkDropped(file.name, this.files, this.multiple) && this.validateType(file.type)) {
      return true;
    } else {
      SwAlert.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ha ocurrido un error!',
        footer: this.multiple ? '<span>Recuerda no subir archivos duplicados y que cumpla solo con el formato: png, jpeg</span>' :
          '<span href>Recuerda subir solo archivos que cumpla solo con el formato: png, jpeg</span>'
      }).then(r => console.log(r));
      return false;
    }
  }
}
