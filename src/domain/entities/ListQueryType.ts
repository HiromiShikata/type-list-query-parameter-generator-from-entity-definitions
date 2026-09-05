export class ListQueryType {
  public readonly entityName: string;
  public readonly entityFilePath: string;
  public readonly outputFilePath: string;

  constructor(
    entityName: string,
    entityFilePath: string,
    outputFilePath: string,
  ) {
    this.entityName = entityName;
    this.entityFilePath = entityFilePath;
    this.outputFilePath = outputFilePath;
  }
}
