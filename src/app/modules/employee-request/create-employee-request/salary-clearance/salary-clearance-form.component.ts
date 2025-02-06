import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { UploadComponent } from '../../upload/upload.component';
import { environment } from 'environments/environment';
import { EmployeeRequestService } from '../../employee-request-api.service';

@Component({
  selector: 'app-salary-clearance-form',
  standalone: true,
  imports: [
      MatFormFieldModule, // Use MatFormFieldModule instead of MatFormField
        ReactiveFormsModule,
        MatLabel, // Correct
        MatSelectModule, // Correct
        MatInputModule, // Required for input fields inside mat-form-field
        MatOptionModule, // Required for mat-option inside mat-select
        MatButtonModule, // Optional, but useful for buttons
        MatDatepickerModule, // Optional, if you use date pickers
        MatNativeDateModule,
        MatRadioModule,
        UploadComponent,
        NgIf,
        UploadComponent,
        NgFor
  ],
  templateUrl: './salary-clearance-form.component.html',
  styleUrl: './salary-clearance-form.component.scss'
})
export class SalaryClearanceFormComponent implements OnInit {
    salaryClearanceForm:FormGroup;
    fileForm:FormGroup;
    @Output() formSubmitted = new EventEmitter<any>();
    @Input() data:any;
    deletedImage:any[]=[]
    uploatedImgate:any[]=[]
    documents:any={'IBAN_certificate':null,'national_residence':null,passport:null}

    constructor(private form: FormBuilder,private api:EmployeeRequestService) { }
  ngOnInit(): void {
    this.salaryClearanceForm = this.form.group({
      salary_certificate_attested: [false, Validators.required],
      certificate_language: ['ar', Validators.required],
      salary_addressed_to: ['general', Validators.required],
      entity_name: ['', this.entityValidator.bind(this)],
      salary_breakdown_type: ['detailed', Validators.required],
      addressed_to_bank: [false, Validators.required],
      documents: this.form.array([
        this.createDocumentGroup('IBAN_certificate'),
        this.createDocumentGroup('national_residence'),
        this.createDocumentGroup('passport'),
      ]),
    })

    this.salaryClearanceForm.get('addressed_to_bank')?.valueChanges.subscribe(value => {
      if(!this.data){
        this.updateDocumentsValidators(value);
      }
    });

    console.log(this.data)
    if(this.data){
      this.salaryClearanceForm.get('salary_certificate_attested').setValue(this.data.salary_certificate_attested);
      this.salaryClearanceForm.get('certificate_language').setValue(this.data.certificate_language);
      this.salaryClearanceForm.get('salary_addressed_to').setValue(this.data.salary_addressed_to);
      if(this.data.entity_name){
        this.salaryClearanceForm.get('entity_name').setValue(this.data.entity_name);
      }
      this.salaryClearanceForm.get('salary_breakdown_type').setValue(this.data.salary_breakdown_type);
      this.salaryClearanceForm.get('addressed_to_bank').setValue(this.data.addressed_to_bank);
      console.log(this.data)
      console.log(this.data.documents)
      this.documents = this.data.documents.reduce((acc, doc) => {
        // Use the 'name' as key and 'url' as value
        acc[doc.name] ={id:doc.id, url:environment.apiUrl+ doc.url,type:doc.mimetype};
        return acc;
      }, {});
    }
// Assuming this.data.documents is an array of objects with 'name' and 'url' properties


    console.log(this.documents)
  }
  
  createDocumentGroup(type: string): FormGroup {
    if(this.data){
      return this.form.group({
        type: [type],   // Store document type
        file: [null],   // Store file as a Blob
        filename: ['']  // Store filename for display
      });
    }
    else{
      return this.form.group({
        type: [type],   // Store document type
        file: [null,[this.bankValidator.bind(this)]],   // Store file as a Blob
        filename: ['']  // Store filename for display
      });
    }
    
  }

  get documentsArray(): FormArray {
    return this.salaryClearanceForm.get('documents') as FormArray;
  }

  bankValidator(control: AbstractControl) {
    // Check if addressed_to_bank is true and the file control is empty
    const addressedToBank = this.salaryClearanceForm?.get('addressed_to_bank')?.value;
  
    // If addressed_to_bank is true and the file is not selected, return required validation
    if (addressedToBank && !control.value) {
      return { required: true };
    }
  
    return null; // Otherwise, it's valid
  }

  updateDocumentsValidators(addressedToBank: boolean) {
    const documentsArray = this.documentsArray;
    documentsArray.controls.forEach(control => {
      const fileControl = control.get('file');
      if (addressedToBank) {
        fileControl?.setValidators([Validators.required]);
      } else {
        fileControl?.clearValidators();
      }
      fileControl?.updateValueAndValidity();
    });
  }


  isFileUploaded(controlName: string): boolean {
    const value = this.salaryClearanceForm.get(controlName)?.value;
    return value && value.length > 0; // Ensures it's an array with at least one file
  }
  
  entityValidator(control: AbstractControl) {
    const entityType = this.salaryClearanceForm?.get('entityType')?.value;
    if (entityType === 'specific' && !control.value) {
      return { required: true };
    }
    return null;
  }


  submitForm(){
    let data;

    if (this.salaryClearanceForm.valid) {
      if(this.uploatedImgate){
        this.uploatedImgate.forEach((image)=>{
          this.api.uploadAttchment(image,this.data.id).subscribe({
            next:(response)=>{

            }
          })
        })
      }

      if(this.deletedImage){
        this.deletedImage.forEach((image)=>{
          this.api.deleteAttchemnt(image).subscribe({
            next:(response)=>{

            }
          });
        })
      }

      const addressedToBank = this.salaryClearanceForm?.get('addressed_to_bank')?.value;
if(addressedToBank && !this.data){
 data={
    ...this.salaryClearanceForm.value,
    hasFile:true
  }
}
  else{
    data={
      ...this.salaryClearanceForm.value
    }
  }   
      this.formSubmitted.emit(data);
    }
  }
  handleFile(file: File, index: number) {
    if (!file) {
      console.error('No file selected');
      return;
    }

    let newName = this.documentsArray.at(index).get('type')?.value;
    const modifiedFile = new File([file], newName, { type: file.type, lastModified: file.lastModified });

    if (index >= 0 && index < this.documentsArray.length) {
      if(this.data){
        this.uploatedImgate.push(modifiedFile);
      }
      this.documentsArray.at(index).patchValue({ file: modifiedFile }); 
      console.log(this.salaryClearanceForm.value);
    } else {
      console.error(`Invalid index: ${index}`);
    }
  }
    removeAttachment(id,type:string){
      delete this.documents[type];
      this.deletedImage.push(id);
    }
}

