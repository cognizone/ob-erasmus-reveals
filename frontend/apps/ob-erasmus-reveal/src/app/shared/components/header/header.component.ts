import { Component } from '@angular/core';
import { NavItem } from "../../models/nav-item";

@Component({
  selector: 'ob-erasmus-reveal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  navItems: NavItem[] = [
    {
      labelKey: 'header.skills',
      path: '#',
    },
    {
      labelKey: 'global.about',
      path: '#',
    },
    {
      labelKey: 'header.sign_in',
      path: '#',
    },
    {
      labelKey: 'header.get_started',
      path: '#',
      className: 'my-nav-get-started'
    },
  ];
}
