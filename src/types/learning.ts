export interface Learning {
    learningId: number;
    name: string;
    link:string;
    enrolledEmployees: EmployeeLearning[];
}

export interface EmployeeLearning {
    id: number;
    employee: number;
    learning:number;
    date: Date;
}