/* eslint-disable import/extensions */
import Model, { ModelConfig } from './model';

export interface PhotoSchema {
  albumId: number;
  id: string | number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export default class Photo extends Model implements PhotoSchema {
  albumId!: number;

  url!: string;

  title!: string;

  thumbnailUrl!: string;

  static config: ModelConfig = {
    endpoint: 'photos',
  };


  constructor(photoData: PhotoSchema) {
    super(photoData.id);
    Object.assign(this, photoData);
  }

  toString() {
    return JSON.stringify(this);
  }
}
