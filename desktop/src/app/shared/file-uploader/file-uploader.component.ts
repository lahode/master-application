import { Component, EventEmitter, ElementRef, Input, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
})
export class FileUploaderComponent {

  @Input() public activeColor: string = 'green';
  @Input() public baseColor: string = '#ccc';
  @Input() public overlayColor: string = 'rgba(255,255,255,0.5)';

  public borderColor: string;
  public iconColor: string;

  public dragging: boolean = false;
  public uploader:FileUploader;

  @Output() public fileOver:EventEmitter<any> = new EventEmitter();
  @Output() public onFileDrop:EventEmitter<File[]> = new EventEmitter<File[]>()
  protected element:ElementRef;

  public constructor(element:ElementRef) {
    this.element = element;
    this.uploader = new FileUploader({url: URL});
  }
    
  onDragEnter(event:any):any {
    this.dragging = true;
    let transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }

    transfer.dropEffect = 'copy';
    this._preventAndStop(event);
    this.fileOver.emit(true);
  }

  onDragLeave(event:any):any {
    this.dragging = false;
    if ((this as any).element) {
      if (event.currentTarget === (this as any).element[0]) {
        return;
      }
    }

    this._preventAndStop(event);
    this.fileOver.emit(false);
  }

  onDrop(event:any):any {
    this.dragging = false;
    let transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    let options = this._getOptions();
    let filters = this._getFilters();
    this._preventAndStop(event);
    this.uploader.addToQueue(transfer.files, options, filters);
    this.fileOver.emit(false);
    this.onFileDrop.emit(transfer.files);
  }

  onChange(event:any):any {
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    let options = this._getOptions();
    let filters = this._getFilters();

    this.uploader.addToQueue(files, options, filters);
    if (this._isEmptyAfterSelection()) {
      this.element.nativeElement.value = '';
    }
  }

  protected _getOptions():any {
    return this.uploader.options;
  }

  protected _getFilters():any {
    return {};
  }

  protected _isEmptyAfterSelection():boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  protected _getTransfer(event:any):any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  }

  protected _preventAndStop(event:any):any {
    event.preventDefault();
    event.stopPropagation();
  }

  protected _haveFiles(types:any):any {
    if (!types) {
      return false;
    }

    if (types.indexOf) {
      return types.indexOf('Files') !== -1;
    }
    else if (types.contains) {
      return types.contains('Files');
    }
    else {
      return false;
    }
  }

}
