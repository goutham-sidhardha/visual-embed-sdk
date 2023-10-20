import { getLogger } from './logger';
// eslint-disable-next-line import/no-cycle
import { EndPoints } from '../auth';

const logger = getLogger('Auth Service');

/**
 *
 * @param url
 * @param options
 */
function failureLoggedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    return fetch(url, options).then(async (r) => {
        if (!r.ok && r.type !== 'opaqueredirect' && r.type !== 'opaque') {
            logger.error('Failure', await r.text?.());
        }
        return r;
    });
}

/**
 *
 * @param authVerificationUrl
 */
export function fetchSessionInfoService(authVerificationUrl: string): Promise<any> {
    return failureLoggedFetch(authVerificationUrl, {
        credentials: 'include',
    });
}

/**
 *
 * @param authEndpoint
 */
export async function fetchAuthTokenService(authEndpoint: string): Promise<any> {
    return fetch(authEndpoint);
}

/**
 *
 * @param thoughtSpotHost
 * @param username
 * @param authToken
 */
export async function fetchAuthService(
    thoughtSpotHost: string,
    username: string,
    authToken: string,
): Promise<any> {
    return failureLoggedFetch(
        `${thoughtSpotHost}${EndPoints.TOKEN_LOGIN}?username=${username}&auth_token=${authToken}`,
        {
            credentials: 'include',
            // We do not want to follow the redirect, as it starts giving a CORS
            // error
            redirect: 'manual',
        },
    );
}

/**
 *
 * @param thoughtSpotHost
 * @param username
 * @param authToken
 */
export async function fetchAuthPostService(
    thoughtSpotHost: string,
    username: string,
    authToken: string,
): Promise<any> {
    return failureLoggedFetch(`${thoughtSpotHost}${EndPoints.TOKEN_LOGIN}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'x-requested-by': 'ThoughtSpot',
        },
        body: `username=${encodeURIComponent(username)}&auth_token=${encodeURIComponent(
            authToken,
        )}`,
        credentials: 'include',
        // We do not want to follow the redirect, as it starts giving a CORS
        // error
        redirect: 'manual',
    });
}

/**
 *
 * @param thoughtSpotHost
 * @param username
 * @param password
 */
export async function fetchBasicAuthService(
    thoughtSpotHost: string,
    username: string,
    password: string,
): Promise<any> {
    return failureLoggedFetch(`${thoughtSpotHost}${EndPoints.BASIC_LOGIN}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'x-requested-by': 'ThoughtSpot',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        credentials: 'include',
    });
}

/**
 *
 * @param thoughtSpotHost
 */
export async function fetchLogoutService(thoughtSpotHost: string): Promise<any> {
    return failureLoggedFetch(`${thoughtSpotHost}${EndPoints.LOGOUT}`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'x-requested-by': 'ThoughtSpot',
        },
    });
}
