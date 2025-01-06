
export interface IRenderContext {
  namespace: string;
}

export class RenderContext implements IRenderContext {
  public readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }
}