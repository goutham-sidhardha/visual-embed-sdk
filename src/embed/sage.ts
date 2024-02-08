/**
 * Copyright (c) 2023
 *
 * Embed ThoughtSpot Sage
 *
 * @summary TS Sage embed
 * @author Mourya Balabhadra <mourya.balabhadra@thoughtspot.com>
 */

import {
    Action, DOMSelector, Param, ViewConfig,
} from '../types';
import { getQueryParamString } from '../utils';
import { V1Embed } from './ts-embed';

/**
 * Configuration for search options
 */
export interface SearchOptions {
    /**
     * The query string to pre-fill in natual language search bar
     */
    searchQuery: string;
    /**
     * Boolean to determine if the search should be executed or not.
     * if it is executed, put the focus on the results.
     * if it’s not executed, put the focus in the search bar - at the end of
     * the tokens
     */
    executeSearch?: boolean;
}

/**
 * The configuration attributes for the embedded Natural language search view. Based on
 * GPT and LLM.
 *
 * @version: SDK: 1.23.0 | ThoughtSpot: 9.4.0.cl, 9.5.1-sw
 * @group Embed components
 */
export interface SageViewConfig
    extends Omit<
        ViewConfig,
        'hiddenHomepageModules' | 'hiddenHomeLeftNavItems' | 'hiddenTabs' | 'visibleTabs' | 'reorderedHomepageModules'
    > {
    /**
     * If set to true, a list of liveboard and answers related
     * to the natural language search will be shown below the
     * AI generated answer.
     *
     * @deprecated Currently liveboard and answers related
     * to the natural language search will not be shown for sage
     * embed
     */
    showObjectResults?: boolean;
    /**
     * flag used by the TS product tour page to show the blue search bar
     * even after the search is completed. This is different from TSE Sage Embed
     * experience where it mimics closer to the non-embed case.
     * The Sample questions container is collapsed when this value is set after
     * does a search.
     *
     * @version SDK: 1.26.0 | Thoughtspot: 9.8.0.cl
     * @hidden
     */
    isProductTour?: boolean;
    /**
     * flag to hide search bar title. default false.
     *
     * @version SDK: 1.26.0 | Thoughtspot: 9.8.0.cl
     */
    hideSearchBarTitle?: boolean;
    /**
     * flag to disable Sage Answer header(`AI Answer` title section on top of the Sage
     * answer). default false.
     *
     * @version SDK: 1.26.0 | Thoughtspot: 9.9.0.cl
     */
    hideSageAnswerHeader?: boolean;
    /**
     * flag to disable changing worksheet. default false.
     *
     * @version SDK: 1.26.0 | Thoughtspot: 9.9.0.cl
     */
    disableWorksheetChange?: boolean;
    /**
     * flag to hide worksheet selector. default false.
     */
    hideWorksheetSelector?: boolean;
    /**
     * If set to true, the search bar auto complete search suggestions will not be shown.
     * default false
     *
     * @version SDK: 1.26.0 | Thoughtspot: 9.9.0.cl
     */
    hideAutocompleteSuggestions?: boolean;
    /**
     * If set to false, the auto complete search suggestions not be shown
     *
     * @deprecated currently, object suggestions will not be shown for sage embed
     * earlier this flag was used to show Auto complete suggestions
     */
    showObjectSuggestions?: boolean;
    /**
     * If set to true, sample questions would be hidden to user.
     * These sample questions are autogenerated based on selected datasource.
     *
     * @version SDK: 1.26.0 | Thoughtspot: 9.10.0.cl
     */
    hideSampleQuestions?: boolean;
    /**
     * The data source GUID to set on load.
     */
    dataSource?: string;
    /**
     * Configuration for search options
     *
     * @version SDK: 1.26.0 | Thoughtspot: 9.8.0.cl
     */
    searchOptions?: SearchOptions;
}
export const HiddenActionItemByDefaultForSageEmbed = [
    Action.Save,
    Action.Pin,
    Action.EditACopy,
    Action.SaveAsView,
    Action.UpdateTML,
    Action.EditTML,
    Action.AnswerDelete,
    Action.Share,
];
/**
 * Embed ThoughtSpot LLM and GPT based natural language search component.
 *
 * @version: SDK: 1.23.0 | ThoughtSpot: 9.4.0.cl, 9.5.1-sw
 * @group Embed components
 */
export class SageEmbed extends V1Embed {
    /**
     * The view configuration for the embedded ThoughtSpot sage.
     *
     */
    protected viewConfig: SageViewConfig;

    // eslint-disable-next-line no-useless-constructor
    constructor(domSelector: DOMSelector, viewConfig: SageViewConfig) {
        viewConfig.embedComponentType = 'SageEmbed';
        super(domSelector, viewConfig);
    }

    /**
     * Constructs a map of parameters to be passed on to the
     * embedded Eureka or Sage search page.
     *
     * @returns {string} query string
     */
    protected getEmbedParams(): string {
        const {
            disableWorksheetChange,
            hideWorksheetSelector,
            showObjectSuggestions,
            hideSampleQuestions,
            isProductTour,
            hideSearchBarTitle,
            hideSageAnswerHeader,
            hideAutocompleteSuggestions,
        } = this.viewConfig;

        const params = this.getBaseQueryParams();
        params[Param.EmbedApp] = true;
        params[Param.IsSageEmbed] = true;
        params[Param.DisableWorksheetChange] = !!disableWorksheetChange;
        params[Param.HideWorksheetSelector] = !!hideWorksheetSelector;
        params[Param.HideEurekaSuggestions] = !!hideAutocompleteSuggestions;
        if (showObjectSuggestions) {
            params[Param.HideEurekaSuggestions] = !showObjectSuggestions;
            // support backwards compatibility
        }
        params[Param.HideSampleQuestions] = !!hideSampleQuestions;
        params[Param.IsProductTour] = !!isProductTour;
        params[Param.HideSearchBarTitle] = !!hideSearchBarTitle;
        params[Param.HideSageAnswerHeader] = !!hideSageAnswerHeader;
        params[Param.HideActions] = [
            ...(params[Param.HideActions] ?? []),
            ...HiddenActionItemByDefaultForSageEmbed,
        ];

        return getQueryParamString(params, true);
    }

    /**
     * Construct the URL of the embedded ThoughtSpot sage to be
     * loaded in the iframe
     *
     * @returns {string} iframe url
     */
    private getIFrameSrc() {
        const path = 'eureka';
        const postHashObj = {};
        const tsPostHashParams = this.getThoughtSpotPostUrlParams();
        const {
            dataSource, searchOptions,
        } = this.viewConfig;

        if (dataSource) postHashObj[Param.WorksheetId] = dataSource;
        if (searchOptions?.searchQuery) {
            postHashObj[Param.Query] = searchOptions?.searchQuery;
            if (searchOptions.executeSearch) {
                postHashObj[Param.executeSearch] = true;
            }
        }
        let sagePostHashParams = new URLSearchParams(postHashObj).toString();
        if (sagePostHashParams) sagePostHashParams = `${tsPostHashParams ? '&' : '?'}${sagePostHashParams}`;

        return `${this.getRootIframeSrc()}/embed/${path}${tsPostHashParams}${sagePostHashParams}`;
    }

    /**
     * Render the embedded ThoughtSpot Sage
     *
     * @returns {SageEmbed} Eureka/Sage embed
     */
    public render(): SageEmbed {
        super.render();

        const src = this.getIFrameSrc();
        this.renderV1Embed(src);

        return this;
    }
}
