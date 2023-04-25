import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noImagen',
})
export class NoImagenPipe implements PipeTransform {
  transform(img: string): string {
    if (!img) {
      return 'assets/layout/images/no-photo.png';
    }

    return img;
  }
}
