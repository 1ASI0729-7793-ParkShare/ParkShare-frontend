import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface StoredFileResource {
  url: string;
}

const DATA_URL_PREFIX = 'data:';

const blobFromDataUrl = (dataUrl: string): Blob => {
  const [header, payload] = dataUrl.split(',');
  const mime = /data:([^;]+)/.exec(header)?.[1] ?? 'image/jpeg';
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
};

/** Uploads photos to the backend, which stores them as files and returns their public URL. */
@Service()
export class FileUploadService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.platformProviderApiBaseUrl}${environment.platformProviderFilesEndpointPath}`;

  upload(file: Blob, fileName = 'photo.jpg'): Observable<string> {
    const body = new FormData();
    body.append('file', file, fileName);
    return this.http.post<StoredFileResource>(this.url, body).pipe(map((stored) => stored.url));
  }

  /**
   * Photos picked in the browser are data URLs; they are uploaded and replaced by their stored URL.
   * Anything that is already a URL is kept as it is.
   */
  resolvePhotos(photos: string[]): Observable<string[]> {
    if (photos.length === 0) return of([]);
    return forkJoin(
      photos.map((photo) =>
        photo.startsWith(DATA_URL_PREFIX) ? this.upload(blobFromDataUrl(photo)) : of(photo),
      ),
    );
  }
}
