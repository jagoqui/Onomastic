import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormConditionsOptions {

    constructor(private http: HttpClient) { }

    getSchools() {
        return this.http.get<any>(`${environment.API_URL}/asociaciones`);
    }

    getAsociations() {
        return this.http.get<any>(`${environment.API_URL}/vinculaciones`);
    }

    getPrograms() {
        return this.http.get<any>(`${environment.API_URL}/programasacademicos`);
    }

}
