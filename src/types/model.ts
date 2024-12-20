import * as THREE from 'three'
export type ModelType = 'cube' | 'sphere' | 'cylinder';

export interface Model {
  id: ModelType;
  name: string;
}

export interface ModelObject {
  [key: string]: THREE.Mesh;
}
