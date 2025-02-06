import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-request',
  standalone: true,
  imports: [NgIf],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @Output() fileSelected = new EventEmitter<File>(); // Emit File instead of custom object

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Store the file

      // Emit the actual file (not a mock object)
      this.fileSelected.emit(file);

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.previewUrl = null;
      }
    }
  }

  removeFile() {
    this.previewUrl = null;
    this.selectedFile = null;
    this.fileSelected.emit(null); // Emit null to clear file in parent
  }
}