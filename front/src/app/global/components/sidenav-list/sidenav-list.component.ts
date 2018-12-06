import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavListComponent {
  @Output() goto = new EventEmitter();
  private _links: SidenavLink[];
  @Input() public set links(links: SidenavLink[]) {
    this._links = links
      .map((link: SidenavLink) => {
        if (link.label) {
          const lowerCased = link.label.toLowerCase();
          const upperCased = link.label.toUpperCase();
          const first = upperCased[0];
          const rest = lowerCased.substring(1);
          link.label = first + rest;
        }
        return link;
      });
  }

  public get links() {
    return this._links;
  }

  public onClick(event) {
    this.goto.emit(event);
  }

}

export class SidenavLink {
  constructor(
    public label: string,
    public path?: any[] | SafeResourceUrl,
    public icon?: string) { }
}
