import { UserManager, WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts'

export const appUrl = window.location.origin

export const config: UserManagerSettings = {
    authority: 'http://127.0.0.1:5001',
    client_id: 'oidc-vue',
    redirect_uri: `${appUrl}/callback`, // sau khi nhận token
    response_mode: 'query',
    response_type: 'code',
    scope: 'openid profile',
    post_logout_redirect_uri: `${appUrl}`, // sau khi đăng xuất
    accessTokenExpiringNotificationTimeInSeconds: 60, // số giây trước khi thông báo token expiring
    automaticSilentRenew: true, // tự động lấy access token trước khi expire
    checkSessionIntervalInSeconds: 5, // kiểm tra seesion sau mỗi 10s
    client_secret: 'secret', // secret
    silentRequestTimeoutInSeconds: 10, // timeout request silent
    silent_redirect_uri: `${appUrl}/silent-callback`, // sau khi nhận token silent
    stateStore: new WebStorageStateStore({ store: window.localStorage }), // lưu thông tin stae
    userStore: new WebStorageStateStore({ store: window.localStorage }) // lưu thông tin user
}

const mgr = new UserManager(config)

export default mgr
