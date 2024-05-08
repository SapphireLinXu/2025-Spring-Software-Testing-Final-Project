import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Todo } from './Todo';
import { v4 as uuidv4 } from 'uuid'; // generate random id

// angular material import
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInput, MatInputModule } from '@angular/material/input';

// component import
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [HeaderComponent,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.css'
})
export class TodoPageComponent implements OnInit{
  @ViewChild("paperNameInput")
  paperNameInput!: ElementRef<MatInput>;
  @ViewChild("linkInput")
  linkInput!: ElementRef<MatInput>;
  @ViewChild("publishConferenceInput")
  publishConferenceInput!: ElementRef<MatInput>;
  @ViewChild("yearMonthInput")
  yearMonthInput!: ElementRef<MatInput>;
  @ViewChild("noteInput")
  noteInput!: ElementRef<MatInput>;
  todoList: Todo[] = [];
  todoEditing!: Todo | null;

  constructor() { }
  

  ngOnInit(): void {
    // this.todoList.push({
    //     id: "001",
    //     status: false,
    //     context: "Test1",
    //     paperName: 'aaa',
    //     link: 'sss',
    //     publishConference: 'ddd',
    //     yearMonth: '20240508',
    //     note: 'dd',
    //     state: 'incomplete'
    // });
    const todoJson = localStorage.getItem("todolist");
    if (todoJson) this.todoList = JSON.parse(todoJson);
}

  changeStatus(todo: Todo): void {
    todo.status = !todo.status;

    localStorage.setItem("todolist", JSON.stringify(this.todoList)); // save to local storage
  }

  delete(todo: Todo): void {
    this.todoList = this.todoList.filter(t => t.id !== todo.id);
    
    localStorage.setItem("todolist", JSON.stringify(this.todoList));
  }

  edit(todo: Todo): void {
    this.todoEditing = todo;
    this.paperNameInput.nativeElement.value = todo.paperName;
    this.linkInput.nativeElement.value = todo.link;
    this.publishConferenceInput.nativeElement.value = todo.publishConference;
    this.yearMonthInput.nativeElement.value = todo.yearMonth;
    this.noteInput.nativeElement.value = todo.note;
    
    localStorage.setItem("todolist", JSON.stringify(this.todoList));
  }
  
  finishEdit(): void {
    this.todoList.forEach(t => {
      if (this.todoEditing && t.id === this.todoEditing.id) {
        // t.context = this.todoInput.nativeElement.value;
        t.paperName = this.paperNameInput.nativeElement.value;
        t.link = this.linkInput.nativeElement.value;
        t.publishConference = this.publishConferenceInput.nativeElement.value;
        t.yearMonth = this.yearMonthInput.nativeElement.value;
        t.note = this.noteInput.nativeElement.value;
      }
    });
    this.todoEditing = null;
    // this.todoInput.nativeElement.value = "";
    this.paperNameInput.nativeElement.value = "";
    this.linkInput.nativeElement.value = "";
    this.publishConferenceInput.nativeElement.value = "";
    this.yearMonthInput.nativeElement.value = "";
    this.noteInput.nativeElement.value = "";
    
    localStorage.setItem("todolist", JSON.stringify(this.todoList));
  }

  add(): void {
    const paperName = this.paperNameInput.nativeElement.value.trim();
    const link = this.linkInput.nativeElement.value.trim();
    const publishConference = this.publishConferenceInput.nativeElement.value.trim();
    const yearMonth = this.yearMonthInput.nativeElement.value.trim();
    const note = this.noteInput.nativeElement.value.trim();
    if (!paperName) return;
    this.todoList.push({
      id: uuidv4(),
      status: false,
      context: '',
      paperName,
      link,
      publishConference,
      yearMonth,
      note,
      state: 'incomplete'
    });
    // this.todoInput.nativeElement.value = "";
    this.paperNameInput.nativeElement.value = "";
    this.linkInput.nativeElement.value = "";
    this.publishConferenceInput.nativeElement.value = "";
    this.yearMonthInput.nativeElement.value = "";
    this.noteInput.nativeElement.value = "";
    
    localStorage.setItem("todolist", JSON.stringify(this.todoList));
  }

  inputKeypress($event: KeyboardEvent): void {
    if ($event.key === "Enter") {
      if (this.todoEditing) this.finishEdit();
      else this.add();
    }
  }

}
