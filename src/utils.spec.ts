/**
 * @jest-environment node
 */

import {
    getQueryParamString,
    getFilterQuery,
    getCssDimension,
    getEncodedQueryParamsString,
    appendToUrlHash,
    getRedirectUrl,
    checkReleaseVersionInBeta,
    setStyleProperties,
    removeStyleProperties,
    getRuntimeParameters,
} from './utils';
import { RuntimeFilterOp } from './types';

describe('unit test for utils', () => {
    test('getQueryParamString', () => {
        expect(
            getQueryParamString({
                foo: 'bar',
                baz: '42',
            }),
        ).toBe('foo=bar&baz=42');
        expect(getQueryParamString({})).toBe(null);
        // should not add undefined params
        expect(
            getQueryParamString({
                foo: undefined,
                bar: 'baz',
            }),
        ).toBe('bar=baz');
    });

    test('getFilterQuery', () => {
        expect(getFilterQuery([])).toBe(null);

        expect(
            getFilterQuery([
                {
                    columnName: 'foo',
                    operator: RuntimeFilterOp.NE,
                    values: ['bar'],
                },
            ]),
        ).toBe('col1=foo&op1=NE&val1=bar');

        const filters = [
            {
                columnName: 'foo',
                operator: RuntimeFilterOp.EQ,
                values: [42],
            },
            {
                columnName: 'bar',
                operator: RuntimeFilterOp.BW_INC,
                values: [1, 10],
            },
            {
                columnName: 'baz',
                operator: RuntimeFilterOp.CONTAINS,
                values: ['abc'],
            },
        ];
        expect(getFilterQuery(filters)).toBe(
            'col1=foo&op1=EQ&val1=42&col2=bar&op2=BW_INC&val2=1&val2=10&col3=baz&op3=CONTAINS&val3=abc',
        );
    });
    test('getParameterOverride', () => {
        expect(getRuntimeParameters([])).toBe(null);

        expect(
            getRuntimeParameters([
                {
                    name: 'foo',
                    value: 'bar',
                },
            ]),
        ).toBe('param1=foo&paramVal1=bar');

        const params = [
            {
                name: 'foo',
                value: 42,
            },
            {
                name: 'bar',
                value: 'abc',
            },
            {
                name: 'baz',
                value: true,
            },
        ];
        expect(getRuntimeParameters(params)).toBe(
            'param1=foo&paramVal1=42&param2=bar&paramVal2=abc&param3=baz&paramVal3=true',
        );
    });

    test('getCssDimension', () => {
        expect(getCssDimension(100)).toBe('100px');
        expect(getCssDimension('100%')).toBe('100%');
        expect(getCssDimension('100px')).toBe('100px');
        expect(getCssDimension(null)).toBe(null);
    });

    test('appendToUrlHash', () => {
        expect(appendToUrlHash('http://myhost:3000', 'hashFrag')).toBe(
            'http://myhost:3000#hashFrag',
        );
        expect(appendToUrlHash('http://xyz.com/#foo', 'bar')).toBe('http://xyz.com/#foobar');
    });

    describe('getRedirectURL', () => {
        test('Should return correct value when path is undefined', () => {
            expect(getRedirectUrl('http://myhost:3000', 'hashFrag')).toBe(
                'http://myhost:3000#hashFrag',
            );
            expect(getRedirectUrl('http://xyz.com/#foo', 'bar')).toBe('http://xyz.com/#foobar');
        });

        test('Should return correct value when path is set', () => {
            Object.defineProperty(window.location, 'origin', {
                get: () => 'http://myhost:3000',
            });

            expect(getRedirectUrl('http://myhost:3000/', 'hashFrag', '/bar')).toBe(
                'http://myhost:3000/bar#hashFrag',
            );

            expect(getRedirectUrl('http://myhost:3000/#/foo', 'hashFrag', '#/bar')).toBe(
                'http://myhost:3000/#/barhashFrag',
            );
        });
    });

    test('getEncodedQueryParamsString', () => {
        expect(getEncodedQueryParamsString('')).toBe('');
        expect(getEncodedQueryParamsString('test')).toBe('dGVzdA');
    });

    test('when ReleaseVersion is empty ', () => {
        expect(checkReleaseVersionInBeta('', false)).toBe(false);
    });

    test('when ReleaseVersion is 7.0.1.cl ', () => {
        expect(checkReleaseVersionInBeta('7.0.1.cl', false)).toBe(false);
    });

    test('when cluster has dev version', () => {
        expect(checkReleaseVersionInBeta('dev', false)).toBe(false);
    });

    test('when cluster is above 8.4.0.cl-11 software version', () => {
        expect(checkReleaseVersionInBeta('8.4.0.cl-117', false)).toBe(false);
    });

    test('when cluster is bellow 8.0.0.sw software version', () => {
        expect(checkReleaseVersionInBeta('7.2.1.sw', false)).toBe(true);
    });

    test('when suppressBetaWarning is true and ReleaseVersion is 7.0.1', () => {
        expect(checkReleaseVersionInBeta('7.0.1', true)).toBe(false);
    });

    test('when suppressBetaWarning is false ReleaseVersion is 7.0.1', () => {
        expect(checkReleaseVersionInBeta('7.0.1', false)).toBe(true);
    });
    describe('setStyleProperties function', () => {
        let element: HTMLElement;

        beforeEach(() => {
            element = document.createElement('div');
        });

        afterEach(() => {
            element = null;
        });

        it('should set style properties on an element', () => {
            const styleProperties = {
                backgroundColor: 'red',
                color: 'blue',
            };

            setStyleProperties(element, styleProperties);

            expect(element.style.backgroundColor).toBe('red');
            expect(element.style.color).toBe('blue');
        });

        it('should handle undefined element and styleProperties', () => {
            // Test when element or styleProperties is undefined
            setStyleProperties(undefined, undefined);

            // No assertions are needed; this is just to ensure no errors are
            // thrown
        });
    });

    describe('removeStyleProperties function', () => {
        let element: HTMLElement;

        beforeEach(() => {
            element = document.createElement('div');
            element.style.backgroundColor = 'red';
            element.style.color = 'blue';
        });

        afterEach(() => {
            element = null;
        });

        it('should remove style properties from an element', () => {
            const styleProperties = ['backgroundColor', 'color'];

            removeStyleProperties(element, styleProperties);

            expect(element.style.backgroundColor).toBe('');
            expect(element.style.color).toBe('');
        });

        it('should handle undefined element and styleProperties', () => {
            // Test when element or styleProperties is undefined
            removeStyleProperties(undefined, undefined);

            // No assertions are needed; this is just to ensure no errors are
            // thrown
        });
    });
});
