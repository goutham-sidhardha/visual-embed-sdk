import 'jest-fetch-mock';
import { getAuthenticationToken } from '../../auth';
import { AuthType } from '../../types';
import * as authService from '../authService';
import { graphqlQuery } from './graphql-request';

describe('Graphql request', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    it('should send authToken if set', async () => {
        jest.spyOn(authService, 'fetchAuthTokenService').mockImplementation(() => ({
            text: () => Promise.resolve('abc'),
        }));
        await getAuthenticationToken({
            thoughtSpotHost: 'testHost',
            getAuthToken: jest.fn(() => Promise.resolve('testToken')),
            authType: AuthType.TrustedAuthTokenCookieless,
        });
        fetchMock.mockResponseOnce('test123');
        await graphqlQuery({
            query: 'query testOp',
            thoughtSpotHost: 'testHost',
            variables: {},
        });
        expect(fetchMock).toBeCalledWith('testHost/prism/?op=testOp', expect.objectContaining({
            headers: {
                Authorization: 'Bearer testToken',
                accept: '*/*',
                'accept-language': 'en-us',
                'content-type': 'application/json;charset=UTF-8',
                'x-requested-by': 'ThoughtSpot',
            },
        }));
    });
});
