import {Employee} from "./Employee";

export default interface Department {
    id: number;
    name: string;
    employees: Employee[];
    boss: Employee | null;
}