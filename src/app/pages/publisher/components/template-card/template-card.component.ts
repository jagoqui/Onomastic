import { Component, Input} from '@angular/core';
import { TemplateCard } from '@shared/models/template-card.model';
import { DomSanitizerService } from '@shared/services/dom-sanitizer.service';

@Component({
  selector: 'app-template-card',
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.scss']
})
export class TemplateCardComponent{
  @Input() card: TemplateCard | undefined;

  constructor(public domSanitizerSvc: DomSanitizerService) { }

}
