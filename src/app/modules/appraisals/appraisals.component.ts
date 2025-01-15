import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { APIAppraisalService } from './api-appraisal.service';
import { single, Subscription } from 'rxjs';
import { appraisalDTO } from './appraisalsModels';
import { VeiwAppraisalComponent } from "./veiw-appraisal/veiw-appraisal.component";
import { ViewAppraisalService } from './view-appraisal.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-appraisals',
  standalone: true,
  imports: [MatIcon, NgIf, NgClass, CommonModule, FormsModule, VeiwAppraisalComponent,MatTableModule],
  templateUrl: './appraisals.component.html',
  styleUrl: './appraisals.component.scss'
})
export class AppraisalsComponent implements OnInit,OnDestroy {
  isSidebarOpen: boolean = false; // Sidebar toggle state for small screens
  getAppraisalSubscription:Subscription;
  allAppraisals:appraisalDTO[];
myAppraisals:appraisalDTO[];
teamApprisals:appraisalDTO[];
  filter='my';  // Default to 'all' filter
  veiwPageOpen:boolean=false;

  starsResult: { category: string; stars: number; total: number }[] = [];

  viewAppraisal:appraisalDTO;
  displayedColumns1: string[] = [
    'id',
    // 'Sequence',
    // 'start_date',
    // 'end_date',
    // 'duration',
    // 'description',
    'Name',
    'state',
    'type',
    'manager',
    'result',
    'date'
];

  constructor(private api:APIAppraisalService,private view:ViewAppraisalService){
    this.view.isOpen$.subscribe((state) => {
      this.veiwPageOpen = state;
    });
  }

  ngOnDestroy(): void {
    this.view.setOpen(false)
    this.getAppraisalSubscription.unsubscribe();
  }
  ngOnInit(): void {
   
    this.getAppraisalSubscription= this.api.getAllAppraisal().subscribe((response:any)=>{
      this.allAppraisals=response.appraisals;
      this.formatManagerDetails();
      this.formatImages()
      this.allAppraisals.forEach((appraisal: any) => {
     
        const parsedManagerFeedback = this.parseHtml(
          appraisal.manager_feedback
        );
        console.log(parsedManagerFeedback)
        const totalStarsData = this.calculateTotalStars(parsedManagerFeedback);
        appraisal.result = totalStarsData.result;
  
        ;})

      this.myAppraisals=this.allAppraisals.filter(m=>m.type=='employee');
      this.teamApprisals=this.allAppraisals.filter(m=>m.type=='manager');
      console.log(response)
    })
  }
  // parseHtml(html: string) {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(html, 'text/html'); // Parse the HTML string
  //   const starSpans = doc.querySelectorAll('span.o_stars'); // Find all star spans

  //   const results = Array.from(starSpans).map((span) => {
  //     const category = span.closest('tr')?.querySelector('td p em')?.textContent?.trim() || 'Unknown';
  //     const filledStars = span.querySelectorAll('.fa-star').length;
  //     const totalStars = span.querySelectorAll('i').length;
  //     return {
  //       category,
  //       stars: filledStars,
  //       total: totalStars,
  //     };
  //   });

  //   this.starsResult = results;
  //   return this.starsResult

  // }
  parseHtml(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html'); // Parse the HTML string

    // Find the <h2> element that contains 'Evaluation'
    const evaluationSection = Array.from(doc.querySelectorAll('h2')).find(h2 => 
        h2.textContent?.includes('Evaluation')
    );

    if (evaluationSection) {
        // Find the table after the Evaluation section
        let table = null;
        
        // Look for the next <table> element after the Evaluation section
        let nextSibling = evaluationSection.nextElementSibling;
        
        // Traverse the DOM to find the <table>
        while (nextSibling) {
            if (nextSibling.tagName === 'TABLE') {
                table = nextSibling;
                break;
            }
            nextSibling = nextSibling.nextElementSibling;
        }

        if (table) {
            // Extract the rows (<tr>) inside the table
            const tableRows = table.querySelectorAll('tr');

            const results = Array.from(tableRows).map((row:any) => {
                const category = row.querySelector('td p em')?.textContent?.trim() || 'Unknown'; // Get the category
                const starSpan = row.querySelector('span.o_stars'); // Find the stars span
                const filledStars = starSpan?.querySelectorAll('.fa-star').length || 0; // Count filled stars
                const totalStars = starSpan?.querySelectorAll('i').length || 0; // Count total stars

                return {
                    category,
                    stars: filledStars,
                    total: totalStars,
                };
            });

            this.starsResult = results;
            return this.starsResult; // Return the results as JSON
        }
    }

    return []; // If no table is found or evaluation section doesn't exist, return an empty array
}

  
  calculateTotalStars( managerFeedback: any): { result: string } {
    let totalStars = 0;
    let fullStars = 0;
console.log(managerFeedback)
    managerFeedback.forEach((feedback: any) => {
      totalStars += feedback.total;
      fullStars += feedback.stars;
    });
var result=fullStars+'/'+totalStars
    return {result};
  }



  
  formatManagerNames(): void {
    this.allAppraisals.forEach((appraisal:any) => {
      if (appraisal.manager_ids) {
        appraisal.managerNames = appraisal.manager_ids
          .map(manager => manager[1])  // Assuming manager[1] contains the name
          .join(', ');
      }
    });
    
  }

  formatManagerDetails(): void {
    this.allAppraisals.forEach((appraisal: any) => {
      if (appraisal.manager_ids) {
        appraisal.managerDetails = appraisal.manager_ids.map(manager => ({
          name: manager[1], // Assuming manager[1] contains the name
          image: this.decodeBase64ToXml(manager[2]), // Assuming manager[2] contains the base64 image data
        }));
      }
    });
    this.allAppraisals.forEach((appraisal: any) => {
      if (appraisal.manager_ids) {
        appraisal.managerEvu = this.parseHtml(appraisal.manager_feedback)
      }
    });
  }

  formatImages(): void {


    this.allAppraisals.forEach((appraisal: any) => {
      if (appraisal.employee_id) {
        appraisal.employee_id[2] = this.decodeBase64ToXml(appraisal.employee_id[2]);
      }
    });
  }

  veiwAppraisalMethod(id:number):void{
this.viewAppraisal=this.allAppraisals.find(m=>m.id==id);
console.log(this.viewAppraisal)
this.view.setOpen(true);
  }

  decodeBase64ToXml(base64: string): string {
    const decodedData = atob(base64);
    return decodedData; // You now have the raw XML string
  }
  
  openSideNav():void{
    this.isSidebarOpen=true;
  }
  closeSideNav():void{
this.isSidebarOpen=false
  }
}
