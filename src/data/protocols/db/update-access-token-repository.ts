export interface IUpdateAccessTokenRepository {
  update: (accountId: string, accessToken: string) => Promise<void>
}
