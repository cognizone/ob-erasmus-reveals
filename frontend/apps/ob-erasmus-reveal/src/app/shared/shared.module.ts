import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslocoModule } from "@ngneat/transloco";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    declarations: [HeaderComponent, FooterComponent],
    imports: [CommonModule, TranslocoModule, RouterModule, MatButtonModule],
    exports: [
        HeaderComponent,
        FooterComponent,
        TranslocoModule,
        RouterModule
    ]
})
export class SharedModule {}
