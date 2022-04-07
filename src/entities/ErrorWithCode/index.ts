export class ErrorWithCode extends Error {
  public status: number

  constructor(message, status) {
    super(message)
    this.status = status
  }
}
