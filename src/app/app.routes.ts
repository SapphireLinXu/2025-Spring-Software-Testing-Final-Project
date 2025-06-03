import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { TodoPageComponent } from './todo-page/todo-page.component';

export const routes: Routes = [
    { path: "about", component: AboutComponent }, // if the path is /about, display the AboutComponent
    { path: "", component: TodoPageComponent } // if the path is /, display the TodoPageComponent
];
