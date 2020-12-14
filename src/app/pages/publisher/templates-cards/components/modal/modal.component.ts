import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {

  mycontent: string;
  @Output() cahange: EventEmitter<File> = new EventEmitter<File>();
  @ViewChild('textEditor') ckeditor: any;
  source = '';
  ckeConfig: any;

  constructor() {
    this.mycontent = `<p>Hola&nbsp;<!--<p--><span style="color:#e74c3c"><strong>&lt;Nombre&gt;&nbsp;</strong></span>en esta&nbsp;<!--<p--><span style="color:#16a085"><strong>&lt;Fecha&gt; </strong></span>la Universidad de Antioquia le desea un feliz cumplea&ntilde;os</p>`;
  }

  ngOnInit() {
    this.ckeConfig = {
      toolbarGroups: [
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'paragraph', groups: ['align', 'list', 'indent', 'blocks', 'bidi', 'paragraph'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'links', groups: ['links'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
      ],
      removeButtons: 'Source,Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Subscript,Superscript,Strike,CopyFormatting,RemoveFormat,NumberedList,BulletedList,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,Table,HorizontalRule,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About'
    };
  }

  updateSource($event: Event) {
    const tarjetName = 'files';
    this.projectImage($event.target[tarjetName][0]);
  }

  projectImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.source = e.target.result;
      this.cahange.emit(file);
    };
    reader.readAsDataURL(file);
  }

  AddName() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length - 3).concat(`<p><span style="color:#e74c3c"><strong>&lt;Nombre&gt;</strong></span></p>`);
  }

  AddDate() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length - 3).concat(`<p><span style="color:#16a085"><strong>&lt;Fecha&gt;</strong></span></p>`);
  }

  AddSchool() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length - 3).concat(`<p><span style="color:#9b59b6"><strong>&lt;Facultad/Escuela&gt;</strong></span></p>`);
  }

  AddAsociation() {
    this.mycontent = this.mycontent.substring(0, this.mycontent.length - 3).concat(`<p><span style="color:#f39c12"><strong>&lt;Asociación&gt;</strong></span></p>`);
  }
}
