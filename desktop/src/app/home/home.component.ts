import { Component, OnInit } from '@angular/core';
/*
import { ExpenseService } from '../expense/expense.service';
*/

@Component({
  selector: 'ob-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  options: Object;
  serieName: string;

  constructor() {}

  /*
  constructor(private expenseService: ExpenseService) {
    this.expenseService.getPercentageByAccountsAndPeriod()
      .subscribe(
        data => {
          this.options = {
            title : { text : 'Résumé de vos activités' },
            chart: { type: 'pie' },
            series: [{
                name: 'budget',
                colorByPoint: true,
                data: data
            }]
          }
        },
        error => console.log(error)
      );
  }

  onPieClicked (e) {
    if (e.point && e.point.name) {
      this.serieName = e.point.name + "(id: " + e.point.id + ")";
    }
  }
  */

  ngOnInit() {
  }

}
