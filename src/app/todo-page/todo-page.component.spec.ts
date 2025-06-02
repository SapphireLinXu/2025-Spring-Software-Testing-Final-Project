import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TodoPageComponent } from './todo-page.component';

describe('TodoPageComponent', () => {
  let component: TodoPageComponent;
  let fixture: ComponentFixture<TodoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoPageComponent,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize todoList with saved data or default', () => {
    // 因為 ngOnInit 可能從 localStorage 讀資料，所以先清掉
    localStorage.removeItem('todolist');
    component.ngOnInit();
    expect(component.todoList.length).toBeGreaterThan(0);
  });

  it('should add a new todo', () => {
    const inputPaperName = component.paperNameInput.nativeElement;
    const inputLink = component.linkInput.nativeElement;
    const inputPublish = component.publishConferenceInput.nativeElement;
    const inputYear = component.yearMonthInput.nativeElement;
    const inputNote = component.noteInput.nativeElement;

    inputPaperName.value = 'Test Paper';
    inputLink.value = 'https://test.com';
    inputPublish.value = 'CVPR';
    inputYear.value = '202406';
    inputNote.value = 'Test note';

    component.add();
    fixture.detectChanges();

    expect(component.todoList.some(todo => todo.paperName === 'Test Paper')).toBeTrue();
  });

  it('should change status and cycle state', () => {
    const todo = component.todoList[0];
    const initialState = todo.state;
    component.changeStatus(todo);

    expect(todo.state).not.toBe(initialState);
    expect(['incomplete', 'processing', 'complete']).toContain(todo.state);
  });

  it('should edit and finish editing a todo', () => {
    const todo = component.todoList[0];
    component.edit(todo);
    fixture.detectChanges();

    component.paperNameInput.nativeElement.value = 'Edited Paper';
    component.linkInput.nativeElement.value = 'https://edited.com';
    component.publishConferenceInput.nativeElement.value = 'ICCV';
    component.yearMonthInput.nativeElement.value = '202501';
    component.noteInput.nativeElement.value = 'Edited Note';

    component.finishEdit();
    fixture.detectChanges();

    const updatedTodo = component.todoList.find(t => t.id === todo.id);
    expect(updatedTodo?.paperName).toBe('Edited Paper');
    expect(updatedTodo?.publishConference).toBe('ICCV');
  });

  
});
