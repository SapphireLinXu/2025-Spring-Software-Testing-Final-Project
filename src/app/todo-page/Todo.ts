export class Todo {
    id: string = '';
    status: boolean = false;
    context: string = '';
    paperName: string = '';
    link: string = '';
    publishConference: string = '';
    yearMonth: string = '';
    note: string = '';
    state: 'complete' | 'processing' | 'incomplete' = 'incomplete';
}
