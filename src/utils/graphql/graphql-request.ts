import { getCachedAuthToken } from '../../auth';
import { getOperationNameFromQuery } from '../../utils';

/**
 *
 * @param root0
 * @param root0.query
 * @param root0.variables
 * @param root0.thoughtSpotHost
 * @param root0.isCompositeQuery
 */
export async function graphqlQuery({
    query,
    variables,
    thoughtSpotHost,
    isCompositeQuery = false,
}: {
    query: string,
    variables: any,
    thoughtSpotHost: string,
    isCompositeQuery?: boolean
}) {
    const operationName = getOperationNameFromQuery(query);
    try {
        const headers: Record<string, string> = {
            'content-type': 'application/json;charset=UTF-8',
            'x-requested-by': 'ThoughtSpot',
            accept: '*/*',
            'accept-language': 'en-us',
        };
        const authToken = getCachedAuthToken();
        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`;
        }
        const response = await fetch(`${thoughtSpotHost}/prism/?op=${operationName}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                operationName,
                query,
                variables,
            }),
            credentials: 'include',
        });
        const result = await response.json();
        const dataValues = Object.values(result.data);
        return (isCompositeQuery) ? result.data : dataValues[0];
    } catch (error) {
        return error;
    }
}
