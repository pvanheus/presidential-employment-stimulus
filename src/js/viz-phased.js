import $ from 'jquery';
import { FORMATTERS } from './utils';
import { VizProgress } from './viz-progress';

const ICONS_SELECTOR = '.icons';
const $iconsTemplate = $(ICONS_SELECTOR).first().clone(true, true);

const FEATURE_BLOCK_SELECTOR = '.feature-value__header.is--phased';
const PHASED_HEADER_SELECTOR = '.phased-header';
const PHASE1_SELECTOR = '.indicator-phase.is--phase-1'; // TODO - need classes here
const PHASE2_SELECTOR = '.indicator-phase.is--phase-2'; // TODO - need classes here
const PHASED_SPLIT_SELECTOR = '.indicator-phase.is--split-column';
const PHASE1_SPLIT_SELECTOR = '.is--split-column.is--phase-1';
const PHASE2_SPLIT_SELECTOR = '.is--split-column.is--phase-2';

const $featureBlockTemplate = $(FEATURE_BLOCK_SELECTOR).first().clone(true, true);
const $phasedHeaderTemplate = $(PHASED_HEADER_SELECTOR).first().clone(true, true);
const $phase1Template = $(PHASE1_SELECTOR).first().clone(true, true);
const $phase2Template = $(PHASE2_SELECTOR).first().clone(true, true);
const $phasedSplitTemplate = $(PHASED_SPLIT_SELECTOR).first().clone(true, true);
const $phase1SplitTemplate = $(PHASE1_SPLIT_SELECTOR).first().clone(true, true);
const $phase2SplitTemplate = $(PHASE2_SPLIT_SELECTOR).first().clone(true, true);


export class VizPhased {
  constructor(lookups, $parent, section_type, viz_type, metric_type, title, value, value_target, phases) {
    this._lookups = lookups;
    this._$parent = $parent;
    this._section_type = section_type;
    this._viz_type = viz_type;
    this._metric_type = metric_type;
    this._title = title;
    this._value = value;
    this._value_target = value_target;
    this._phases = phases;

    this.render();

    }

    render() {

        let formatter = FORMATTERS[this._metric_type];

        let $featureBlock = $featureBlockTemplate.clone(true, true);
        $featureBlock.empty();

        // HEADER
        
        let $phasedHeader = $phasedHeaderTemplate.clone(true, true);
        $phasedHeader.find('.phased-header__title').text(this._title);
        $phasedHeader.find('.phased-header__value').text(this._value ? formatter(this._value) : '');    

        let $icons = $iconsTemplate.clone(true, true);
        $phasedHeader.find('.phased-header__icon').empty();
        $phasedHeader.find('.phased-header__icon').append($icons.find('.icon--' + this._lookups["icon"][this._title]));

        $featureBlock.append($phasedHeader);

        // PHASES
        
        if(this._viz_type == 'percentile') {

            let $splitContainer = $phasedSplitTemplate.clone(true, true);
            $splitContainer.empty();

            for (let phase = 1; phase <= this._phases.length; phase++) {

                let $phase = $phase1SplitTemplate.clone(true, true);
    
                if(phase == 2) {
                    $phase = $phase2SplitTemplate.clone(true, true);
                }

                let $progressContainer = $phase.find('.feature-value__phase_chart-wrapper');
                $progressContainer.empty();
                
                new VizProgress(
                    $progressContainer[0], 
                    this._phases[phase - 1].value / this._phases[phase - 1].value_target,
                    phase
                );
    
                $splitContainer.append($phase);
            }

            $featureBlock.append($splitContainer);


        } else {

            for (let phase = 1; phase <= this._phases.length; phase++) {

                let $phase = $phase1Template.clone(true, true);
    
                if(phase == 2) {
                    $phase = $phase2Template.clone(true, true);
                }

                $phase.find('.feature-value__amount').text(formatter(this._phases[phase - 1].value));

                if(this._phases[phase - 1].value_target != undefined) {
                    $phase.find('.feature-value__value-description').text(formatter(this._phases[phase - 1].value_target));
                } else {
                    $phase.find('.feature-value__value-description').hide();
                }

                let $progressContainer = $phase.find('.feature-value__header_chart-wrapper');
                $progressContainer.empty();

                if (this._metric_type == 'currency') {
                    $progressContainer.remove();
                } else {
                    new VizProgress(
                        $progressContainer[0], 
                        this._phases[phase - 1].value / this._phases[phase - 1].value_target,
                        phase
                    );
                }
    
                $featureBlock.append($phase);
            }
        }

        this._$parent.append($featureBlock);

    }
}
