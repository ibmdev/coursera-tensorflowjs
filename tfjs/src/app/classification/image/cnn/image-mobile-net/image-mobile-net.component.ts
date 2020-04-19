import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { loadLayersModel, LayersModel } from '@tensorflow/tfjs';
import { LoadResourceService } from '@utils/load-resource.service';
import { ClassifierImageService } from '@mobilenet/classifier-image.service';
import * as mobilenet from '@tensorflow-models/mobilenet';

@Component({
  selector: 'app-image-mobile-net',
  templateUrl: './image-mobile-net.component.html',
  styleUrls: ['./image-mobile-net.component.scss']
})
export class ImageMobileNetComponent implements OnInit {

  @ViewChild('animalElement') animalElement: ElementRef;

  modelLocal: any;
  modelRemote: LayersModel;
  IMAGE_SIZE = 224;
  spinnerLoaded = false;
  MOBILENET_MODEL_PATH = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
  CAT_IMAGE = 'assets/classification/mobilenet/images/animals/marmot.jpg';

  constructor(
    private loadResourceService: LoadResourceService,
    private renderer2: Renderer2, private classifierImageService: ClassifierImageService) {
    console.log('Initialisation Image MobileNet Component');
  }

  async ngOnInit() {
    // Chargement de MobileNet depuis le répertoire source du projet (local)
    this.modelLocal = await mobilenet.load();
    // Chargement de MobileNet en mémoire depuis internet (accès distant)
    this.modelRemote = await loadLayersModel(this.MOBILENET_MODEL_PATH);
    this.spinnerLoaded = true;
    const imageCat = await this.loadResourceService.getImageAsElementHTML(this.CAT_IMAGE, true);
    const predictions = await this.modelLocal.classify(imageCat);
    console.log('Prediction : ', predictions);
    document.getElementById('animal').appendChild(imageCat);
    this.renderer2.listen(this.animalElement.nativeElement.children[0], 'click', (event) => {
      this.classifierImageService.classify(this.modelRemote, imageCat);
    });
  }
}
