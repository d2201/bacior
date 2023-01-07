import { AuthScopeStrategy } from '../scopeStrategy'

export class SheetsScopeStrategy implements AuthScopeStrategy {
  public readonly scopes = [
    // Source: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get#authorization-scopes
    // 'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.readonly',
    // 'https://www.googleapis.com/auth/drive.file',
    // 'https://www.googleapis.com/auth/spreadsheets',
    // 'https://www.googleapis.com/auth/spreadsheets.readonly',
  ]
}
