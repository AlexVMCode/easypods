import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { URL_SERVICES } from '../config/endpoints';
import { Report, ReportAdapter } from '../models/report';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {

  constructor(private http: HttpClient, private adapter: ReportAdapter) {
    super();
  }

  /**
   * @description Servicio para consultar estadisticas
   */
  public getReport(params: any): Observable<Report> {
    return this.http.post(`${URL_SERVICES.URL_REPORT}/GenerateStatisticalAnalysis`, params)
      .pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
      .pipe(
        map((response: any) => this.adapter.adapt(response.resultData)
        )
      );
  }
}