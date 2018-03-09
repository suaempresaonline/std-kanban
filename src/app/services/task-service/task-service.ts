import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {

	task = {
		title: null,
		option: null,
		developer: null,
		redmine_id: null, 
	}

    constructor(public http: Http) {}

	getTask() {
		return this.task;
	}

	setTask(data) {
		this.task.title = data.title;
		this.task.option = data.option;
		this.task.developer = data.developer;
		this.task.redmine_id = data.redmine_id;

		this.setRemoteTask(data).subscribe(data => {
			console.log(data.result);
		});
	
	}

	setDefault() {
		this.task.title = null;
		this.task.option = null;
		this.task.developer = null;
		this.task.redmine_id = null;
	}

	setRemoteTask(data) {
		return this.http.post('http://dash.solutudo.com/task/request.json', data).map(this.extractData);
	}

	updateTasks(data) {
		return this.http.post('http://dash.solutudo.com/task/update.json', data).map(this.extractData);
	}
	
	getRedmineTasks() {
		return this.http.get('http://dash.solutudo.com/task/redmine.json').map(this.extractData);
	}
	
	extractData = (res: Response) => {
        let body = res.json();
        return body || {};
    }


}