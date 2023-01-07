import { AuthScopeStrategy } from '../scopeStrategy'

export class DriveScopeStrategy implements AuthScopeStrategy {
  scopes = ['https://www.googleapis.com/auth/drive.readonly']
}
