/* eslint-disable array-callback-return */
/* eslint-disable new-cap */
import { NonFunctionKeys } from 'utility-types';
// eslint-disable-next-line import/extensions
import Axios from 'axios';
import api, { ApiParams } from '../api';

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;
type GenericModel<T extends Model> = { new(data: any): T; config: ModelConfig };

enum QueryFilterOrder {
  Asc = 'asc',
  Desc = 'desc',
}

interface QueryFilter {
  where?: Record<string, any>;
  limit?: number;
  page?: number;
  sort?: string;
  order?: QueryFilterOrder;
}

interface FindByIdOptions {
  includes: string[];
}

type ModelIdType = number | string;

export enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}

/**
 * Define the configuration of a relation
 */
export interface Relation {
  /** Type of the relation: hasMany, belongsTo, ... */
  type: RelationType;

  /** The target Model */
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  model: any;

  /**
   * The key containing the relation link
   * - on the target model if hasMany
   * - on the current model if belongsTo
   */
  foreignKey: string;
}

export interface ModelConfig {
  /**
   * The endpoint on the remote API, example 'users'
   */
  endpoint: string;

  /**
   * The definition of the relations
   */
  relations?: Record<string, Relation>;
}

export default abstract class Model {
  protected static config: ModelConfig;

  id: string | number;

  constructor(id: string | number) {
    this.id = id;
  }

  static async create<T extends Model>(dataOrModel: SchemaOf<T> | T): Promise<T[]> {
    const { data } = await api.post<T[]>(`${this.config.endpoint}`, dataOrModel);
    return data;
  }

  static async find<T extends Model>(filter?: QueryFilter): Promise<T[]> {
    const params: ApiParams = {};
    if (filter) {
      if (filter.where) {
        for (const wfilter of Object.keys(filter.where)) {
          params[wfilter] = filter.where[wfilter];
        }
      }
      if (filter.limit) {
        params._limit = filter.limit;
      }
      if (filter.page) {
        params._page = filter.page;
      }
      if (filter.sort) {
        params._sort = filter.sort;
      }
      if (filter.order) {
        params._order = filter.order;
      }
    }
    const { data } = await api.get<T[]>(`${this.config.endpoint}`, { params });
    return data;
  }

  static async findById<T extends Model>(this: GenericModel<T>, id: ModelIdType, options?: FindByIdOptions): Promise<T> {
    const { data } = await api.get<SchemaOf<T>>(`${this.config.endpoint}/${id}`);
    const modelT = new this(data);
    if (options) {
      let modelsTab: string[];
      if (this.config.relations) {
        modelsTab = Object.keys(this.config.relations);
      }
      await Promise.all(options.includes.map(async (include) => {
        if (modelsTab.includes(include) && this.config.relations) {
          const { foreignKey, model } = this.config.relations[include];
          const typedInclude = include as keyof T;
          if (Object.keys(modelT).includes(foreignKey)) {
            const valueToFind = foreignKey as keyof T;
            const itemGet = await api.get<T>(`${model.config.endpoint}/${modelT[valueToFind]}`);
            modelT[typedInclude] = new model(itemGet.data);
          } else {
            const itemsGet = await api.get(`${this.config.endpoint}/${id}/${model.config.endpoint}`);
            if (itemsGet.data.length) {
              const itemsForSet = itemsGet.data.map((newItem: Record<string, any>) => new model(newItem));
              modelT[typedInclude] = itemsForSet;
            }
          }
        }
      }));
    }
    return modelT;
  }


  /* static updateById<T extends Model>(model: T): Promise<T[]>; */

  /* static async updateById<T extends Model>
  (id: ModelIdType, data: Partial<SchemaOf<T>>): Promise<T[]>; */

  static async deleteById(id: ModelIdType): Promise<boolean> {
    await api.delete(`${this.config.endpoint}/${id}`);
    return true;
  }

  /* /**
   * Push changes that has occurred on the instance
   */
  /* async save<T extends Model>(this: T): Promise<T> {
    await Axios.update(`${this.modelClass.config.endpoint}/${this.id}`, JSON.stringify(this));
    return this;
  } */

  /**
   * Push given changes, and update the instance
   */
  /* async update<T extends Model>(this: T, data: Partial<SchemaOf<T>>): Promise<T> {
    await Axios.patch(`${this.config.endpoint}/${this.id}`, JSON.stringify(data));
    return this;
  } */

  /**
   * Remove the remote data
   */
  /* async remove(): Promise<boolean> {
    const success = await Axios.deleteData(`${this.modelClass.config.endpoint}/${this.id}`);
    return success;
  } */
}
