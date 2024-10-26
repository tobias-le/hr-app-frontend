export interface Employee {
  employeeId: number;
  name: string;
  department: {name:string};
  contractType: string;
  workPercentage: string;
  contractualHours: number;
  accountNumber: string;
  availableTimeOff: number;
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
