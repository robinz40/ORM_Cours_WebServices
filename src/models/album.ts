/* eslint-disable import/extensions */

import User, { UserSchema } from './user';

import Photo, { PhotoSchema } from './photo';

import Model, { ModelConfig, Relation, RelationType } from './model';

import api = require('../api');


export interface AlbumSchema {
  userId: number;
  id: string | number;
  title: string;
}

export class Album extends Model implements AlbumSchema {
  userId!: number;

  title!: string;

  user?: UserSchema;

  photos?: PhotoSchema[];

  static config: ModelConfig = {
    endpoint: 'albums',
    relations: {
      photos: {
        type: RelationType.HasMany,
        model: Photo,
        foreignKey: 'albumId',
      },
      user: {
        type: RelationType.BelongsTo,
        model: User,
        foreignKey: 'userId',
      },
    },
  };


  constructor(albumData: AlbumSchema) {
    super(albumData.id);
    Object.assign(this, albumData);
  }

  /* async loadIncludes(includes: string[]): Promise<void> {
    await Promise.all(includes.map(async (include) => {
      console.log(include);
      switch (include) {
        case 'user':
          const { data: userData } = await api.get<UserSchema>(`users/${this.userId}`);
          this.user = userData;
          break;
        case 'photos':
          const { data: photoData } = await api.get<PhotoSchema[]>(`photos?albumId=${this.id}`);
          this.photos = photoData;
          break;
      }
    }));
  }
 */
  toString() {
    return JSON.stringify(this);
  }
}

export default Album;
