import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Combo } from 'src/app/shared/interfaces/combo';
import { Report } from 'src/app/shared/models/report';
import { LoginService } from 'src/app/shared/services/login.service';
import { ReportService } from 'src/app/shared/services/report.service';
import { DetailComponent } from './detail/detail.component';

export const GRI_DATE_FORMATS: MatDateFormats = {
  ...MAT_NATIVE_DATE_FORMATS,
  display: {
    ...MAT_NATIVE_DATE_FORMATS.display,
    dateInput: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    } as Intl.DateTimeFormatOptions,
  }
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: GRI_DATE_FORMATS },
  ]
})
export class HomeComponent implements OnInit {

  marketId: number;
  reportForm: FormGroup;
  reportData: Report = new Report(0, 0, 0, [], [], [], "", 0, "", 0, "", 0);
  greenMin: number = 0;
  yellowMin: number = 0;
  colorList: Array<Combo> = [];
  statusList: Array<Combo> = [];
  userList: Array<Combo> = [];
  idInterval: any;

  constructor(
    private readonly adapter: DateAdapter<Date>,
    private reportService: ReportService,
    public loginService: LoginService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.adapter.setLocale("es-Es");
    this.marketId = Number(this.loginService.getCurrentMarketId());
    this.reportForm = this.formBuilder.group({
      marketId: [this.marketId, Validators.required],
      greenMin: [5, [Validators.required, Validators.pattern('^[0-9]*$')]],
      yellowMin: [10, [Validators.required, Validators.pattern('^[0-9]*$')]],
      startDate: ['', new FormControl<Date | null>(null)],
      endDate: ['', new FormControl<Date | null>(null)],
    });
  }

  get f() {
    return this.reportForm.controls;
  }


  ngOnInit(): void {
    this.getReport();
    this.idInterval = setInterval(() => {
      this.getReport();
    }, 15000);
  }

  ngOnDestroy() {
    if (this.idInterval) {
      clearInterval(this.idInterval);
    }
  }

  getReport() {
    this.reportService.getReport(this.reportForm.value).subscribe(
      response => {
        this.reportData = response;
        this.greenMin = this.reportForm.value.greenMin;
        this.yellowMin = this.reportForm.value.yellowMin;
      },
      error => {
        console.log(error);
      }
    )
  }

  openDialog(color: string | null, statusId: number | null, userName: string | null) {

    this.colorList = [];
    this.statusList = [];
    this.userList = [];

    this.colorList = [
      {
        label: 'Menor de ' + this.greenMin + ' min',
        value: this.reportData.green,
      },
      {
        label: 'Entre ' + this.greenMin + ' - ' + this.yellowMin + ' min',
        value: this.reportData.yellow,
      },
      {
        label: 'Mayor  de ' + this.yellowMin + ' min',
        value: this.reportData.red,
      }
    ];

    this.reportData.ordersByState.forEach(element => {
      let item: Combo = {
        label: element.statusName,
        value: element.statusId,
      };
      this.statusList.push(item);
    });

    this.reportData.ordersByAssignment.forEach(element => {
      let item: Combo = {
        label: element.userName,
        value: element.userName,
      };
      this.userList.push(item);
    });

    const dialogRef = this.dialog.open(DetailComponent, {
      data: {
        color: color,
        statusId: statusId,
        userName: userName,
        colorList: this.colorList,
        statusList: this.statusList,
        userList: this.userList,
        ordersDetail: this.reportData.orderDetailReport,
      },
      maxWidth: '95vw',
    });
  }

  resetForm() {
    this.reportForm.get('startDate')?.setValue('');
    this.reportForm.get('endDate')?.setValue('');
    this.reportForm.get('greenMin')?.setValue('5');
    this.reportForm.get('yellowMin')?.setValue('10');
  }
}
