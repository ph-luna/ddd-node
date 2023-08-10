export class BodyParserError extends Error {
  public readonly type: string

  constructor (message: string, type: string) {
    super(message)
    this.name = 'BodyParserError'
    this.type = type
  }
}
