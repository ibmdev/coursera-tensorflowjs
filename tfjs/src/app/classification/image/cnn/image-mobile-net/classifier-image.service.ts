import { Injectable } from '@angular/core';
import { LayersModel, tidy, scalar, memory, browser, image } from '@tensorflow/tfjs';
import { ImageNetClasses } from '@mobilenet/image-net-classes';


@Injectable({
  providedIn: 'root'
})
export class ClassifierImageService {

  ERROR_MODEL_UNDEFINED_MESSAGE = 'No model defined';
  IMAGE_SIZE = 224;
  TOPK_PREDICTIONS = 3;

  constructor() {}
  async classify(model: LayersModel, imageP: any) {
    if (!model || model === null) {
      throw TypeError(this.ERROR_MODEL_UNDEFINED_MESSAGE);
    }
    // Prediction
    const prediction = await this.predict(model, imageP);
    console.log('Résultat : ', prediction);
  }
  async predict(model: LayersModel, imageP: any) {
    // Fonction tidy permet d'exécuter une fonction fn et nettoyer les tensors alloués par fn
    // Exceptés les tensors retournés par fn
    // Eviter les fuites mémoires
    const logits = tidy(() => {

      // Conversion de l'image en Tensor
      const imageTensor = browser.fromPixels(imageP).toFloat();
      // Redimensionnement de l'image à la taille IMAGE_SIZE par interpolation bilinéaire
      const resized = image.resizeBilinear(imageTensor, [this.IMAGE_SIZE, this.IMAGE_SIZE]);
      const offset = scalar(127.5);
      const normalized = resized.sub(offset).div(offset);
      const batched = normalized.expandDims(0);
      console.log('Nombre de Tensors alloués dans Tidy : ', memory().numTensors);
      return model.predict(batched);

    });
    // Calcul des probabilités des N premières classes à partir des logits
    const predictions = await this.getTopKClasses(logits, this.TOPK_PREDICTIONS);
    console.log('Nombre de Tensors en sortie de Tidy : ', memory().numTensors);
    return predictions;
  }
  async getTopKClasses(logits: any, topK: number) {
    const values = await logits.data();
    const valuesAndIndices = [];
    for (let i = 0; i < values.length; i++) {
      valuesAndIndices.push({value: values[i], index: i});
    }
    valuesAndIndices.sort((a, b) => {
      return b.value - a.value;
    });
    const topkValues = new Float32Array(topK);
    const topkIndices = new Int32Array(topK);
    for (let i = 0; i < topK; i++) {
      topkValues[i] = valuesAndIndices[i].value;
      topkIndices[i] = valuesAndIndices[i].index;
    }

    const topClassesAndProbs = [];
    for (let i = 0; i < topkIndices.length; i++) {
      topClassesAndProbs.push({
        className: ImageNetClasses[topkIndices[i]],
        probability: topkValues[i]
      });
  }
    return topClassesAndProbs;
  }
}
