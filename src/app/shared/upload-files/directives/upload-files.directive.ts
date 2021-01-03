import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import SwAlert from 'sweetalert2';

import { ImageValidator } from '../helpers/image-validators';
import { FileUpload } from '../models/file-upload';


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

  @HostListener('dragover', ['$event'])
  onDragEnter(event: Event) {
    this.avoidOpeningBrowser(event);
    this.mouseOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave() {
    this.mouseOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    const dataTransfer = this.getDataTransfer(event);
    if (!dataTransfer) {
      return;
    }
    this.avoidOpeningBrowser(event);
    this.extractFiles(event, dataTransfer.files);
    this.mouseOver.emit(false);
  }

  @HostListener('change', ['$event'])
  private extractFiles(event: any, fileList?: FileList): void {
    const filesListAux = fileList ? fileList : event.target.files;
    for (const property of Object.getOwnPropertyNames(filesListAux)) {
      const tempFile = filesListAux[property];
      if (this.canBeUploaded(tempFile)) {
        const newFile = new FileUpload(tempFile);
        this.files.push(newFile);
        this.get_FileSrc(tempFile);
      }
    }
  }


  get_FileSrc(file: any) {
    const reader = new FileReader();
    reader.onload = e => this.fileSrc.emit(reader.result);
    reader.readAsDataURL(file);
  }

  private getDataTransfer(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private canBeUploaded(file: File): boolean {
    if (!this.checkDropped(file.name, this.files, this.multiple) && this.validateType(file.type)) {
      return true;
    } else {
      SwAlert.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ha ocurrido un error!',
        footer: this.multiple ? '<span href>Recuerda no subir archivos duplicados y que cumpla solo con el formato: png, jpeg</span>' :
          '<span href>Recuerda subir solo archivos que cumpla solo con el formato: png, jpeg</span>'
      });
      return false;
    }
  }

  private avoidOpeningBrowser(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
