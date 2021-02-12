import { Observable } from 'rxjs';

export class FileUpload {
  public name: string;
  public uploading = false;
  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;
  public path?: string;
  constructor(public file: File = file) {
    this.name = file.name;
  }
}
