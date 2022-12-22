import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CountriesService, Country, Counts, FeedbacksService } from '@app/core';
import { I18nService } from '@cognizone/i18n';
import { LangString } from '@cognizone/model-utils';
import { OnDestroy$ } from '@cognizone/ng-core';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ob-erasmus-reveal-countries-map',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './countries-map.component.html',
  styleUrls: ['./countries-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesMapComponent extends OnDestroy$ implements AfterViewInit {
  @Input()
  skillUri: string = 'http://reveal.org/data/skill/02'; // TODO remove default when connected to skill cloud click

  @ViewChild('myChart')
  container!: ElementRef<HTMLElement>;

  private chart?: echarts.ECharts;

  constructor(
    private http: HttpClient,
    private countriesService: CountriesService,
    private i18nService: I18nService,
    private feedbacksService: FeedbacksService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    const geoJson$ = this.http.get<any>('assets/data/world.json');

    // need to regen map on lang change to update country labels
    this.subSink = combineLatest([
      geoJson$,
      this.countriesService.getAll(),
      this.feedbacksService.getCountsPerCountry(this.skillUri),
      this.i18nService.selectActiveLang(),
    ]).subscribe(([geoJson, countries, counts]) => {
      this.createChart(geoJson, countries, counts);
    });
  }

  private createChart(geoJson: any, countries: Country[], counts: Counts): void {
    if (!this.chart) {
      const chartDom = this.container.nativeElement;
      this.chart = echarts.init(chartDom);
    }

    const data = this.generateData(countries, counts);
    const geoJsonId = 'WORLD';

    echarts.registerMap(geoJsonId, geoJson);

    this.chart.setOption({
      title: {
        text: '',
        subtext: '',
        sublink: '',
      },
      tooltip: {
        trigger: 'item',
        formatter: ({ data }: FormatterArg) => {
          return `${this.i18nService.czLabelToString(data.label)} - ${data.value}`;
        },
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
      },
      visualMap: {
        min: data.min,
        max: data.max,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered'],
        },
      },
      series: [
        {
          name: 'Countries',
          type: 'map',
          map: geoJsonId,
          label: {
            show: false,
            formatter: ({ data }: FormatterArg) => {
              return this.i18nService.czLabelToString(data.label);
            },
          },
          data: data.data,
        },
      ],
    });
  }

  private generateData(countries: Country[], counts: Counts): SeriesData {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    const data = countries.map<Data>(country => {
      const value = counts[country['@id']] ?? 0;
      min = value < min ? value : min;
      max = value > max ? value : max;

      return {
        name: country['@id'],
        label: country.prefLabel!,
        value,
      };
    });
    return {
      min,
      max,
      data,
    };
  }
}

interface SeriesData {
  min: number;
  max: number;
  data: Data[];
}

interface Data {
  name: string;
  value: number;
  label: LangString;
}

interface FormatterArg {
  data: Data;
}
