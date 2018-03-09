import { Output, Component, Inject , Input} from '@angular/core';
import { MatFormFieldModule } from '@angular/material';
import { DragulaService } from 'ng2-dragula';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TaskService } from './services/task-service/task-service';
import { MnFullpageModule } from 'ngx-fullpage';
import { MnFullpageService } from 'ngx-fullpage';


@Component({
	selector: 'new-task-dialog',
	templateUrl: 'new-task-dialog.html',
	providers: [
		// The locale would typically be provided on the root module of your application. We do it at
		// the component level here, due to limitations of our example generation script.
		{provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
	
		// `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
		// `MatMomentDateModule` in your applications root module. We provide it at the component level
		// here, due to limitations of our example generation script.
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
		{provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
	]
})

export class NewTaskDialog {
	
	developers = [
		'Bruno Montanha',
		'David Pinheiro',
		'Luis Pinheiro',
		'Luis Soler',
		'Renan Nogueira',
		'Rérisson Fumes'
	];

	constructor(
		public taskService: TaskService, 
		public dialogRef: MatDialogRef<NewTaskDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private adapter: DateAdapter<any>) { }

	br() {
		this.adapter.setLocale('br');
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	setTask() {
		this.taskService.setTask(this.data);
		this.dialogRef.close();
	}

}

declare var Pusher: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.css',
		'../../node_modules/dragula/dist/dragula.css'
	]
})

export class AppComponent {
	task = {
		title: '',
		option: 'td',
		developer: '',
		redmine_id: ''
	};
	
	todo = [];
	doing = [];
	done = [];
	tasks;
	pusher;
	channels;
	channelTask;
	channelTasks;
	
	constructor(private dragulaService: DragulaService, public dialog: MatDialog, public taskService: TaskService, public fullpage: MnFullpageService) {
		dragulaService.setOptions('bag-one', {
			removeOnSpill: false
		});

		/*setInterval(function(){
			fullpage.moveSectionDown();
		}, 10000);*/

		dragulaService.dropModel.subscribe((value) => {
			console.log(`drop: ${value[0]}`);
			this.onDrop(value.slice(1));
		});

		this.pusher = new Pusher('712647c1414e97ffb74b', {
			cluster: 'us2'}
		);
		this.channels = [];
	}

	private onDrop(args) {
		console.log(args);
		this.tasks = [this.todo, this.doing, this.done];
		this.taskService.updateTasks(this.tasks).subscribe(data => {
			console.log(data.result);
		});
	}

	public getRedmineTasks() {
		this.taskService.getRedmineTasks().subscribe(data => {
			this.todo = data.tasks.todo;
			this.doing = data.tasks.doing;
			this.done = data.tasks.done;
			console.log(data.tasks);
		});
	}

	ngOnInit() {
		//this.getTasks('xd');
		this.listenAction();
		this.getRedmineTasks();

		/*setInterval(function(){
			this.getRedmineTasks();
		}, 1000);*/

		setInterval(() => { this.getRedmineTasks(); }, 1000 * 60 * 5);
	}

	listenAction() {
		this.channelTask = this.pusher.subscribe('task-channel');
		this.channelTask.bind('new-task', function(data) {
			this.insertTask(data.task);
		}.bind(this));

		this.channelTasks = this.pusher.subscribe('task-channel');
		this.channelTasks.bind('update-tasks', function(data) {
			console.log(data);
			this.todo = data.tasks[0];
			this.doing = data.tasks[1];
			this.done = data.tasks[2];
		}.bind(this));
	}

	openDialog(): void {
		let dialogRef = this.dialog.open(NewTaskDialog, {
			width: '50%',
			data: {title: this.task.title, option: this.task.option, developer: this.task.developer, redmine: this.task.redmine_id}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
			//this.insertTask(this.taskService.getTask());
		});
	}

	insertTask(data) {
		
		if (data.title == null || data.title == '') {
			console.log('No title');
			return;
		}

		if (data.developer == null || data.developer == '') {
			console.log('No developer');
			return;
		}

		console.log(data);

		switch (data.option) {
			case 'td':
				this.todo.push(Object.assign({}, data));
				this.taskService.setDefault();
				break;

			case 'di':
				this.doing.push(Object.assign({}, data));
				this.taskService.setDefault();
				break;

			case 'dn':
				this.done.push(Object.assign({}, data));
				this.taskService.setDefault();
				break;

			default:
				break;
				
		}
	}

}
