import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Plantilla, TemplateCard,} from '@app/shared/models/template-card.model';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateCardsService {

  constructor(private http: HttpClient) {
  }

  newCardTemplate(plantilla: Plantilla, image: File): Observable<TemplateCard> {
    const cardBlob = new Blob([JSON.stringify(plantilla)], {type: 'application/json'});
    console.log(plantilla.texto, cardBlob);

    const formData = new FormData();
    formData.append('file', image);
    formData.append('plantilla', cardBlob);
    return this.http
      .post<TemplateCard>(`${environment.apiUrl}/plantillas`, formData, {
        reportProgress: true,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // }
      });
  }

  getAllCards(): Observable<Plantilla[]> {
    return this.http
      .get<Plantilla[]>(`${environment.apiUrl}/plantillas`);
  }
}
