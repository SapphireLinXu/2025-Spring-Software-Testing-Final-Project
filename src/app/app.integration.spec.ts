import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Routes, Router } from '@angular/router';
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { TodoPageComponent } from './todo-page/todo-page.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// 假頁面用來測導頁
@Component({ template: '<p>About Page</p>' })
class AboutComponent {}

const routes: Routes = [
  { path: '', component: TodoPageComponent },
  { path: 'about', component: AboutComponent }
];

describe('Integration Test: HeaderComponent & TodoPageComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent],
      imports: [
        HeaderComponent,
        TodoPageComponent,
        RouterTestingModule.withRoutes(routes),
        NoopAnimationsModule
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await router.initialNavigation(); // 初始化路由
  });

  it('should navigate to /about when navigate("about") is called', async () => {
    component.navigate('about');
    await fixture.whenStable(); // 等待導航完成
    expect(location.path()).toBe('/about');
  });

  it('should load todo from localStorage in TodoPageComponent', () => {
    // 模擬 localStorage 有一筆資料
    localStorage.setItem('todolist', JSON.stringify([
      { id: '001', status: false, context: '', paperName: 'Test', link: '', publishConference: '', yearMonth: '', note: '', state: 'incomplete' }
    ]));

    const todoFixture = TestBed.createComponent(TodoPageComponent);
    const todoComp = todoFixture.componentInstance;
    todoFixture.detectChanges();

    expect(todoComp.todoList.length).toBeGreaterThan(0);
    expect(todoComp.todoList[0].paperName).toBe('Test');
  });
});
