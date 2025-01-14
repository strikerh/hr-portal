import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { appraisalDTO } from '../appraisalsModels';
import { ViewAppraisalService } from '../view-appraisal.service';
import { CommonModule, NgFor } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'veiw-appraisal',
  standalone: true,
  imports: [MatIcon,CommonModule,NgFor],
  templateUrl: './veiw-appraisal.component.html',
  styleUrl: './veiw-appraisal.component.scss',
  encapsulation: ViewEncapsulation.None // Makes styles global

})
export class VeiwAppraisalComponent implements OnChanges,OnInit{
@Input('data') data!:appraisalDTO;
appraisal!:appraisalDTO;
userFedback!:string;
managerFedback!:string;
managerImages:any;
employeeImage:string;


constructor(private view:ViewAppraisalService,private router: Router){
  this.appraisal=this.data;
    console.log(this.appraisal)
   

  }
  ngOnInit(): void {
    window.history.pushState(null, '', window.location.href);
  
    // Use an arrow function to keep 'this' bound to the component instance
    window.addEventListener('popstate', (event) => this.onBackPressed());
  }
  
  onBackPressed() {
    // Ensure that `this.view` is defined
    this.view.setOpen(false);
  }
  decodeBase64ToXml(base64: string): string {
    const decodedData = atob(base64);
    return decodedData; // You now have the raw XML string
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.appraisal = changes['data'].currentValue;
      this.userFedback=this.appraisal.employee_feedback
      this.managerFedback=this.appraisal.manager_feedback
      this.employeeImage = this.appraisal.employee_id[2]

    // Decode manager images
    this.managerImages = this.appraisal.manager_ids.map(manager => this.decodeBase64ToXml(manager[2])); 

      console.log('Appraisal data updated:', this.appraisal);
      console.log(this.appraisal.employee_feedback)
      this.parseResponseToJson(this.appraisal.employee_feedback);
      console.log(this.appraisal)

    }


}
parseResponseToJson(htmlResponse: string) {
  // Create a temporary div element to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlResponse, 'text/html');

  const result:any = {
    work: [],
    future: [],
    feelings: {
      company: [],
      own: []
    }
  };

  // Parse "My work" section
  let currentSection = result.work;

  // Select all h3 elements (the questions)
  const workSection = doc.querySelectorAll('h3');

  workSection.forEach((h3) => {
    const questionText = h3.textContent.trim();
    const description = h3.nextElementSibling ? h3.nextElementSibling.querySelector('em')?.textContent.trim() : '';

    // Move to "My future" section based on question text
    if (questionText.includes('future')) {
      currentSection = result.future;
    } 
    // Move to "My feelings" section
    else if (questionText.includes('feelings')) {
      currentSection = result.feelings;
    }

    // Add the question and description to the correct section
    if (currentSection === result.feelings) {
      // Handle star ratings (this is specific to the "feelings" section)
      if (h3.nextElementSibling?.querySelectorAll('.fa-star').length) {
        const section = questionText.includes('company') ? result.feelings.company : result.feelings.own;
        section.push({
          question: questionText,
          rating: this.getRating(h3)
        });
      }
    } else {
      currentSection.push({
        question: questionText,
        description: description
      });
    }
  });
console.log(result)
  return result;
}

private getRating(h3Element: Element) {
  // Find the number of stars (fa-star elements) and return the count
  const stars = h3Element.querySelectorAll('.fa-star').length;
  return stars;
}

backMethod(){
  this.view.setOpen(false);
}

}
