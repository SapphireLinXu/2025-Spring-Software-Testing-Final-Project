import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodoPageComponent } from './todo-page.component';
import { Todo } from './Todo';


describe('TodoPageComponent', () => {
  let component: TodoPageComponent;
  let fixture: ComponentFixture<TodoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [TodoPageComponent, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize todoList with saved data or default', () => {

    localStorage.removeItem('todolist');
    component.ngOnInit();
    expect(component.todoList.length).toBeGreaterThan(0);
  });

  it('should add a new todo', () => {

    component.paperNameInput.nativeElement.value = 'Test Paper';
    component.linkInput.nativeElement.value = 'https://test.com';
    component.publishConferenceInput.nativeElement.value = 'CVPR';
    component.yearMonthInput.nativeElement.value = '2024/06';
    component.noteInput.nativeElement.value = 'Test note';


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

    component.yearMonthInput.nativeElement.value = '2025/01';
    component.noteInput.nativeElement.value = 'Edited Note';

    component.finishEdit();
    fixture.detectChanges();

    const updatedTodo = component.todoList.find(t => t.id === todo.id);
    expect(updatedTodo?.paperName).toBe('Edited Paper');
    expect(updatedTodo?.publishConference).toBe('ICCV');
  });

  it('should not add a todo if paperName is empty', () => {
    component.todoList = [];
    component.paperNameInput.nativeElement.value = '';
    component.add();
    expect(component.todoList.length).toBe(0);
  });

  it('should handle localStorage.setItem failure gracefully', () => {
    spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');

    expect(() => component.add()).not.toThrow();
  });

  // 111550064: 補 state 分支測試與 delete()
  it('should change state from processing to complete', () => {
    const todo: Todo = {
      id: 'p1',
      status: false,
      context: '',
      paperName: '',
      link: '',
      publishConference: '',
      yearMonth: '2022/03',
      note: '',
      state: 'processing'
    };
    component.todoList = [todo];
    component.changeStatus(todo);
    expect(todo.state).toBe('complete');
  });

  it('should change state from complete to incomplete', () => {
    const todo: Todo = {
      id: 'p2',
      status: false,
      context: '',
      paperName: '',
      link: '',
      publishConference: '',
      yearMonth: '',
      note: '',
      state: 'complete'
    };
    component.todoList = [todo];
    component.changeStatus(todo);
    expect(todo.state).toBe('incomplete');
  });

  it('should fallback to incomplete if state is unknown', () => {
    const todo = {
      id: 'p3',
      status: false,
      context: '',
      paperName: '',
      link: '',
      publishConference: '',
      yearMonth: '',
      note: '',
      state: '???'
    } as unknown as Todo;


    component.todoList = [todo];
    component.changeStatus(todo);
    expect(todo.state).toBe('incomplete');
  });

  it('should delete a todo from the list', () => {
    const todo1: Todo = {
      id: 't1',
      status: false,
      context: '',
      paperName: 'A',
      link: '',
      publishConference: '',
      yearMonth: '',
      note: '',
      state: 'incomplete'
    };
    const todo2: Todo = {
      id: 't2',
      status: false,
      context: '',
      paperName: 'B',
      link: '',
      publishConference: '',
      yearMonth: '',
      note: '',
      state: 'incomplete'
    };
    component.todoList = [todo1, todo2];
    component.delete(todo1);
    expect(component.todoList.length).toBe(1);
    expect(component.todoList[0].id).toBe('t2');
  });
    it('should call finishEdit if Enter is pressed and editing', () => {
    component.todoEditing = component.todoList[0]; // 模擬正在編輯
    const finishSpy = spyOn(component, 'finishEdit');
    component.inputKeypress({ key: 'Enter' } as KeyboardEvent);
    expect(finishSpy).toHaveBeenCalled();
  });

  it('should call add if Enter is pressed and not editing', () => {
    component.todoEditing = null; // 模擬不是編輯狀態
    const addSpy = spyOn(component, 'add');
    component.inputKeypress({ key: 'Enter' } as KeyboardEvent);
    expect(addSpy).toHaveBeenCalled();
  });

  it('should do nothing if key is not Enter', () => {
    const addSpy = spyOn(component, 'add');
    const finishSpy = spyOn(component, 'finishEdit');
    component.inputKeypress({ key: 'Escape' } as KeyboardEvent);
    expect(addSpy).not.toHaveBeenCalled();
    expect(finishSpy).not.toHaveBeenCalled();
  });

  it('should not add a todo when paperName is empty', () => {
  component.todoList = []; // 確保列表是空的
  component.paperNameInput.nativeElement.value = '';
  component.linkInput.nativeElement.value = '';
  component.publishConferenceInput.nativeElement.value = '';
  component.yearMonthInput.nativeElement.value = '';
  component.noteInput.nativeElement.value = '';

  component.add();
  expect(component.todoList.length).toBe(0); // ✅ 不應新增
  
  });

  it('not add todo if yM invalid', () => {
  component.paperNameInput.nativeElement.value = 'Edited Paper';
  component.linkInput.nativeElement.value = 'https://edited.com';
  component.publishConferenceInput.nativeElement.value = 'ICCV';
  component.yearMonthInput.nativeElement.value = '202404'; // ❌ 錯格式
  component.noteInput.nativeElement.value = 'Edited Note';

  component.todoList = [];
  component.add();

  expect(component.todoList.length).toBe(0);
  });



});
