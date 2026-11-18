
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { READER_API_URL } from './cauhinh';
import { DocGiaData } from './models';

@Injectable({ providedIn: 'root' })
export class ReaderService {
  constructor(private http: HttpClient) {}

  danhSach(search = '') {
    return this.http.get<any>(`${READER_API_URL}/readers`, {
      params: { page: '1', limit: '100', search }
    });
  }

  chiTiet(id: number) {
    return this.http.get<DocGiaData>(`${READER_API_URL}/readers/${id}`);
  }

  docGiaHienTai() {
    return this.http.get<any>(`${READER_API_URL}/readers/me`);
  }

  tao(data: Partial<DocGiaData>) {
    return this.http.post(`${READER_API_URL}/readers`, data);
  }

  capNhat(id: number, data: Partial<DocGiaData>) {
    return this.http.patch(`${READER_API_URL}/readers/${id}`, data);
  }

  doiTrangThai(id: number, cardStatus: string) {
    return this.http.patch(
      `${READER_API_URL}/readers/${id}/card-status`,
      { cardStatus }
    );
  }
}
