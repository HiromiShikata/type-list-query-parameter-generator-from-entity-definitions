export class EntityDefinition {
  public readonly name: string;
  public readonly filePath: string;

  constructor(name: string, filePath: string) {
    this.name = name;
    this.filePath = filePath;
  }
}
