import $ from 'jquery';
import { FORMATTERS } from './utils';
import { VizProgress } from './viz-progress';

const ICON_SELECTORS = {
    livelihoods: '.icon.icon--support',
    job_opportunities: '.icon.icon--jobs-created',
    jobs_retain: '.icon.icon--jobs-retained',
    targets: '.icon.icon--budget',
    budget_allocated: '.icon.icon--budget',
};
const icons = Object.keys(ICON_SELECTORS).reduce((obj, key) => ({
    ...obj,
    [key]: $(ICON_SELECTORS[key]).clone(true, true),
}), {});

const CONTAINER_SELECTOR = '.components .feature-value__inner';
const NAME_SELECTOR = '.feature-value__label';
const ICON_CONTAINER_SELECTOR = '.feature-value__header_icon-wrapper';
const VALUE_SELECTOR = '.feature-value__amount';
const SUB_VALUE_SELECTOR = '.feautre-value__sub-amount';

const PROGRESS_CLASS = 'feature-value__header_chart-wrapper';

const $containerTemplate = $(CONTAINER_SELECTOR).first().clone(true, true);

export class OverviewSection {
    constructor($parent, title, sectionType, metricType, value, target) {
        this._$parent = $parent;
        this._title = title;
        this._sectionType = sectionType;
        this._metricType = metricType;
        this._formatter = FORMATTERS[this._metricType];
        this._value = value === -1 ? null : value;
        this._target = target === -1 ? null : target;
        this._quotient = this._target
            ? this._value / this._target : null;
        if (sectionType === 'targets') {
            this._topText = this._formatter(this._target);
            this._bottomText = `${metricType === 'currency' ? 'SPEND' : 'ACHIEVED'}: ${this._formatter(this._value)}`;
        } else {
            this._topText = this._formatter(this._value);
            this._bottomText = this._target ? `TARGET: ${this._formatter(this._target)}` : null;
        }
        this.render();
    }

    get $el() {
        return this._$el;
    }

    render() {
        this._$el = $containerTemplate.clone(true, true);
        this._$parent.append(this._$el);
        const $icon = icons[this._sectionType].clone(true, true);
        this._$el.find(ICON_CONTAINER_SELECTOR).append($icon);
        this._$el.find(NAME_SELECTOR).text(this._title);
        this._$el.find(VALUE_SELECTOR).text(this._topText);
        this._$el.find('img').remove();
        const $subValue = this._$el.find(SUB_VALUE_SELECTOR);
        if (this._bottomText) {
            $subValue.text(this._bottomText);
        } else {
            $subValue.remove();
        }
        const $chartWrapper = this._$el.find(`.${PROGRESS_CLASS}`);
        if (this._quotient) {
            const chartId = `progress-chart-${Math.round(Math.random() * 1000000)}`;
            $chartWrapper.attr('id', chartId);
            new VizProgress(`#${chartId}.${PROGRESS_CLASS}`, this._quotient);
        } else {
            $chartWrapper.remove();
        }
    }
}
