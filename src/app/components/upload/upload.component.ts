import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Optional, Output, SkipSelf, forwardRef, OnInit } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [MatIcon, NgForOf, JsonPipe, AsyncPipe, MatProgressBar, NgIf],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UploadComponent),
            multi: true,
        },
    ],
})
export class UploadComponent implements ControlValueAccessor, OnInit {
    // @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() uploadType: 'base64' | 'url' | 'blob' = 'url';
    @Input() multiFiles: boolean = false;
    @Output() isUploading = new EventEmitter<boolean>();

    private onChange: (value: any) => void;
    private onTouched: () => void;

    imageUrls: { imgData: string; imgName: string, fileTypes: string }[] = [];
    uploadedPaths: any[] = [];
    uploading$sub: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    get uploading$() {
        return this.uploading$sub.asObservable();
    }

    get formGroup(): FormGroup {
        return this.controlContainer.control as FormGroup;
    }

    constructor(@Optional() @SkipSelf() private controlContainer: ControlContainer) {

    }

    onFileSelected(event: any): void {
        const files = event.target.files;
        const fileNames = Array.from(files).map((file) => file['name']);
        this.uploading$sub.next(fileNames);
        if ((this.uploadType = 'base64')) {
            Array.from(files).forEach((file: Blob) => {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const base64String = e.target.result;
                    if (this.multiFiles){
                        this.uploadedPaths.push(base64String);
                        this.imageUrls.push({ imgData: base64String, imgName: file['name'], fileTypes: file['type'] });
                    }else {
                        this.uploadedPaths = [base64String];
                        this.imageUrls = [{ imgData: base64String, imgName: file['name'] , fileTypes: file['type']}];
                    }

                    this.formGroup.get(this.formControlName).setValue(this.uploadedPaths);
                    this.uploading$sub.next(this.uploading$sub.value.filter((name) => !fileNames.includes(name)));
                };
                reader.readAsDataURL(file);
            });
        }
    }

    writeValue(value: any): void {
        if (value) {
            this.uploadedPaths = value;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        // Handle the disabled state if needed
    }

    checkIfUploading(imgName: string) {
        return !!this.uploading$sub.value.find((name) => name === imgName);
    }

    ngOnInit(): void {
        this.uploading$sub.subscribe((files) => {
            if (this.formControlName) {
                console.log('this.uploadedPaths formGroup', this.formGroup.get(this.formControlName));
                console.log('this.uploadedPaths', this.uploadedPaths);
                this.formGroup.get(this.formControlName).setValue(this.uploadedPaths);
            }
            this.isUploading.emit(files.length > 0);
            console.log(files.length > 0, files);
        });
    }
}
