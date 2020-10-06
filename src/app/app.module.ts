import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from '../services/data.service';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomPaginationComponent } from './custom-pagination/custom-pagination.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbdSortableHeader } from '../services/sortable.directive';

@NgModule({
  declarations: [
    AppComponent,
    CustomPaginationComponent,
    NgbdSortableHeader
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ClarityModule,
    BrowserAnimationsModule,
    NgxPaginationModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
