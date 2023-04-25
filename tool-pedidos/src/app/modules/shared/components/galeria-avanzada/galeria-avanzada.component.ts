import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Galleria } from 'primeng/galleria';
import { IImagen } from '../../interfaces/galeriaAvanzada';

@Component({
  selector: 'app-galeria-avanzada',
  templateUrl: './galeria-avanzada.component.html',
  styleUrls: ['./galeria-avanzada.component.scss'],
})
export class GaleriaAvanzadaComponent implements OnInit {
  @Input() images: IImagen[] = [];

  @ViewChild('galleria') galleria: Galleria | null = null;

  showThumbnails = true;

  fullscreen = false;

  activeIndex = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFullScreenListener: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  galleriaResponsiveOptions: any[] = [
    {
      breakpoint: '1060px',
      numVisible: 4,
    },
    {
      breakpoint: '900px',
      numVisible: 3,
    },
    {
      breakpoint: '750px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  ngOnInit(): void {
    this.bindDocumentListeners();
  }

  onThumbnailButtonClick() {
    this.showThumbnails = !this.showThumbnails;
  }

  toggleFullScreen() {
    if (this.fullscreen) {
      this.closePreviewFullScreen();
    } else {
      this.openPreviewFullScreen();
    }
  }

  openPreviewFullScreen() {
    // this.onFullScreenChange();
    if (this.galleria) {
      const elem =
        this.galleria.element.nativeElement.querySelector('.p-galleria');

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem['mozRequestFullScreen']) {
        /* Firefox */
        elem['mozRequestFullScreen']();
      } else if (elem['webkitRequestFullscreen']) {
        /* Chrome, Safari & Opera */
        elem['webkitRequestFullscreen']();
      } else if (elem['msRequestFullscreen']) {
        /* IE/Edge */
        elem['msRequestFullscreen']();
      }
    }
  }

  onFullScreenChange() {
    this.fullscreen = !this.fullscreen;
  }

  closePreviewFullScreen() {
    // this.onFullScreenChange();
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    else if (document['mozCancelFullScreen']) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      document['mozCancelFullScreen']();
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    else if (document['webkitExitFullscreen']) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      document['webkitExitFullscreen']();
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    else if (document['msExitFullscreen']) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      document['msExitFullscreen']();
    }
  }

  bindDocumentListeners() {
    this.onFullScreenListener = this.onFullScreenChange.bind(this);
    document.addEventListener('fullscreenchange', this.onFullScreenListener);
    document.addEventListener('mozfullscreenchange', this.onFullScreenListener);
    document.addEventListener(
      'webkitfullscreenchange',
      this.onFullScreenListener
    );
    document.addEventListener('msfullscreenchange', this.onFullScreenListener);
  }

  unbindDocumentListeners() {
    document.removeEventListener('fullscreenchange', this.onFullScreenListener);
    document.removeEventListener(
      'mozfullscreenchange',
      this.onFullScreenListener
    );
    document.removeEventListener(
      'webkitfullscreenchange',
      this.onFullScreenListener
    );
    document.removeEventListener(
      'msfullscreenchange',
      this.onFullScreenListener
    );
    this.onFullScreenListener = null;
  }

  ngOnDestroy() {
    this.unbindDocumentListeners();
  }

  galleriaClass() {
    return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
  }

  fullScreenIcon() {
    return `pi ${
      this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'
    }`;
  }
}
