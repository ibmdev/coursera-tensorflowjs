import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadResourceService {

  constructor(private httpClient: HttpClient) { }
  getImageAsBlob(path: string): Observable<Blob> {
    return this.httpClient.get(path, {responseType: 'blob'});
  }
  async getImageAsElementHTML(path: string, base64?: boolean) {
    return new Promise<any>((resolve, reject) => {
      const blobSubscriber = this.getImageAsBlob(path).subscribe((blob) => {
        const reader = new FileReader();
        const img: any = document.createElement('img');
        reader.onload = (e: Event) => {
          img.src = (base64 && base64 === true) ? reader.result : path;
          blobSubscriber.unsubscribe();
          resolve(img);
        };
        reader.readAsDataURL(blob);
      });
    });
  }
}
