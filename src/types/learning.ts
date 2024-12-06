export interface Learning {
    learningId: number;
    name: string;
    link:string;
    enrolledEmployees: EmployeeLearning[];
}

export interface LearningDto {
    learningId: number;
    name: string;
    link: string;
}

export interface LearningAssignmentDto {
    learningId: number;
    employeeId: number;
}

export interface EmployeeLearning {
    id: {
        employeeId: number;
        learningId: number;
    }
    date: Date;
}