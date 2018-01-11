import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NewTaskDialog } from './app.component';

import { TaskService } from './services/task-service/task-service';
import { HttpModule } from '@angular/http';

import {
	MatButtonModule,
	MatCheckboxModule,
	MatInputModule,
	MatFormFieldModule,
	MatMenuModule,
	MatToolbarModule,
	MatIconModule,
	MatCardModule,
	MatDialogModule,
	MatDatepicker,
	MatDatepickerModule,
	MatNativeDateModule,
	MatSelectModule,
	MatRadioModule

} from '@angular/material';

import { AppComponent } from './app.component';


const materialModules = [
	MatRadioModule,
	MatSelectModule,
	MatNativeDateModule,
	MatDatepickerModule,
	MatIconModule,
	MatCardModule,
	MatToolbarModule,
	MatFormFieldModule,
	MatInputModule,
	BrowserModule,
	FormsModule,
	DragulaModule,
	BrowserAnimationsModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule
];


@NgModule({
	declarations: [
		AppComponent,
		NewTaskDialog
	],
	imports: [materialModules, FlexLayoutModule, HttpModule],
	exports: [materialModules],
	providers: [TaskService],
	bootstrap: [AppComponent],
	entryComponents: [NewTaskDialog]
})
export class AppModule { }
