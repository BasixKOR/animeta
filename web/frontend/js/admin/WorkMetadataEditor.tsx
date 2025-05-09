import * as React from 'react';
import { FormGroup, FormLabel, FormCheck, FormControl } from 'react-bootstrap';
import { getCompanies } from './ApiClient';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { ScheduleEditor } from './ScheduleEditor';
import { Schedule, WorkMetadata } from './WorkMetadata';

const sourceTypesV2 = [
    'MANGA',
    'ORIGINAL',
    'LIGHT_NOVEL',
    'GAME',
    'FOUR_KOMA',
    'VISUAL_NOVEL',
    'NOVEL',
];

interface Props {
    title: string;
    metadata: WorkMetadata;
    onChange(newMetadata: WorkMetadata): any;
    onAnnImport?(annId: string): any;
}

export default class WorkMetadataEditor extends React.Component<Props> {
    render() {
        const { metadata } = this.props;
        return (
            <>
                <FormGroup>
                    <FormLabel>AnimeNewsNetwork ID</FormLabel>
                    <FormControl
                        name="annId"
                        value={metadata.annId || ''}
                        onChange={this.handleAnnIdChange}
                    />
                    {this.props.onAnnImport && (
                    <button onClick={this.handleAnnImport} disabled={!metadata.annId}>
                        Import Metadata
                    </button>
                    )}
                </FormGroup>
                <FormGroup>
                    <FormLabel>Periods</FormLabel>
                    {this.renderPeriodCheckboxes()}
                </FormGroup>
                <FormGroup>
                    <FormLabel>Schedule (JP)</FormLabel>
                    <ScheduleEditor
                        country="jp"
                        value={metadata.schedules && metadata.schedules['jp']}
                        broadcastOptions={[]}
                        onChange={this.handleScheduleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Schedule (KR)</FormLabel>
                    <ScheduleEditor
                        country="kr"
                        value={metadata.schedules && metadata.schedules['kr']}
                        broadcastOptions={['ANIPLUS', 'ANIMAX']}
                        onChange={this.handleScheduleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Source</FormLabel>
                    <div>
                        {sourceTypesV2.map(source => (
                            <FormCheck type="radio" inline name="source" value={source} checked={metadata.source === source}
                                onChange={this.handleInputChange}
                                label={source}
                                id={source} />
                        ))}
                    </div>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Studios</FormLabel>
                    <AsyncCreatableSelect
                        isMulti
                        loadOptions={(q: string) => getCompanies()
                            .then((data: any) => data.filter((it: any) => it.name.toLowerCase().indexOf(q.toLowerCase()) == 0)
                                .map((it: any) => ({ label: it.name, value: it.name })))}
                        defaultOptions
                        cacheOptions
                        filterOption={null}
                        value={(metadata.studios || []).map(it => ({ label: it, value: it }))}
                        onChange={this.handleStudiosChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl
                        name="durationMinutes"
                        value={metadata.durationMinutes || ''}
                        onChange={this.handleInputChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl
                        name="website"
                        value={metadata.website || ''}
                        onChange={this.handleInputChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Namuwiki Reference</FormLabel>
                    <FormControl
                        name="namuRef"
                        value={metadata.namuRef || ''}
                        onChange={this.handleNamuRefChange}
                    />
                    {this.props.title && (
                    <div>
                        {[this.props.title, `${this.props.title}#애니메이션`, `${this.props.title}/애니메이션`].map(namuRef => (
                            <button onClick={() => this.setNamuRef(namuRef)}>
                                {namuRef}
                            </button>
                        ))}
                    </div>
                    )}
                </FormGroup>
                <FormGroup>
                    <FormLabel>JA Wikipedia Reference</FormLabel>
                    <FormControl
                        name="jaWikipediaRef"
                        value={metadata.jaWikipediaRef || ''}
                        onChange={this.handleInputChange}
                    />
                </FormGroup>
            </>
        );
    }

    private renderPeriodCheckboxes() {
        const periods = this.props.metadata.periods || [];
        const currentYear = new Date().getFullYear();
        const lines = [];
        for (var y = 2014; y <= currentYear + 1; y++) {
            const items = [];
            const maxQuarter = y <= currentYear ? 4 : 1;
            for (var q = 1; q <= maxQuarter; q++) {
                const period = `${y}Q${q}`;
                items.push(
                    <FormCheck
                        type="checkbox"
                        inline
                        checked={periods.indexOf(period) !== -1}
                        onChange={this.handlePeriodCheckboxChange}
                        value={period}
                        label={`Q${q}`}
                        id={period}
                    />
                );
            }
            lines.unshift(
                <div key={'y' + y}>
                    <FormLabel className="mr-sm-2">{y}</FormLabel>
                    {items}
                </div>
            );
        }
        return lines;
    }

    private handlePeriodCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = e.target;
        const period = el.value;
        let periods = this.props.metadata.periods || [];
        periods = periods.filter(p => p !== period);
        if (el.checked) {
            periods.push(period);
        }
        periods.sort();
        this.props.onChange({ ...this.props.metadata, periods });
    };

    private handleAnnIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = e.target;
        const value = el.value.replace(/^https?:\/\/(?:www\.)?animenewsnetwork\.com\/encyclopedia\/anime\.php\?id=([0-9]+)$/, '$1');
        if (value) {
            this.props.onChange({
                ...this.props.metadata,
                annId: value,
            });
        } else {
            const {annId: _, ...rest} = this.props.metadata;
            this.props.onChange(rest);
        }
    };

    private handleNamuRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = e.target;
        let value = el.value;
        if (value.startsWith('https://namu.wiki/w/')) {
            const url = new URL(value);
            const page = decodeURIComponent(url.pathname.substring('/w/'.length));
            const anchor = decodeURIComponent(url.hash.substring(1));
            value = anchor ? `${page}#${anchor}` : page;
        }
        if (value) {
            this.props.onChange({
                ...this.props.metadata,
                namuRef: value,
            });
        } else {
            const {namuRef: _, ...rest} = this.props.metadata;
            this.props.onChange(rest);
        }
    };

    private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = e.target;
        if (el.value) {
            this.props.onChange({
                ...this.props.metadata,
                [el.name]: el.value,
            });
        } else {
            const {[el.name]: _, ...rest} = this.props.metadata as any;
            this.props.onChange(rest);
        }
    };

    private handleStudiosChange = (newOptions: any) => {
        this.props.onChange({
            ...this.props.metadata,
            studios: newOptions.length > 0 ? newOptions.map((it: any) => it.value) : null,
        });
    };

    private handleScheduleChange = (country: string, newSchedule: Schedule) => {
        const schedules = this.props.metadata.schedules || {};
        delete schedules[country];
        if (newSchedule) {
          schedules[country] = newSchedule;
        }
        this.props.onChange({
            ...this.props.metadata,
            schedules,
        });
    };

    private handleAnnImport = () => {
        if (this.props.metadata.annId && this.props.onAnnImport)
            this.props.onAnnImport(this.props.metadata.annId);
    };

    private setNamuRef(namuRef: string) {
        this.props.onChange({
            ...this.props.metadata,
            namuRef,
        });
    }
}
