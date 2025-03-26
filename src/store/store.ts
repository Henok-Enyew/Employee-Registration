import axios from 'axios';
import { create } from 'zustand';
import { notifications } from '@mantine/notifications';

interface User {
  id: number;
  email: string;
  name: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  sex: string;
  phone_number: string;
  position: string;
  salary: number;
  hire_date: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, passsword: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  fetchUser: () => Promise<void>;
}

interface EmployeeState {
  employees: Employee[];
  addEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  fetchEmployee: () => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  login: async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/token/', {
        email,
        password,
      });
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        set({ token });
        return true;
      }
    } catch (err) {
      console.error('Login failed', err);
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  },
  register: async (name, email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/create/', {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        const user = response.data.user || response.data;
        set({ user });
        return true;
      }
    } catch (err) {
      console.error('Error while registering: ', err);
    }
    return false;
  },
  fetchUser: async () => {
    try {
      const token = localStorage.getItem('token');
      // if (!token) return ;
      const response = await axios.get('http://127.0.0.1:8000/api/user/me/', {
        headers: { Authorization: `Token ${token}` },
      });
      const user = response.data.user || response.data;
      set({ user });
    } catch (err) {
      console.error('Error occured');
    }
  },
}));

const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  addEmployee: async (employee: Employee) => {
    try {
      const token = localStorage.getItem('token');
      const data = { ...employee, hire_date: new Date().toISOString() };
      const response = await axios.post('http://127.0.0.1:8000/api/employee/employees/', data, {
        headers: { Authorization: `Token ${token}` },
      });
      set((state) => ({ employees: [...state.employees, response.data] }));
      notifications.show({
        title: 'Employee Added',
        message: 'The employee has been added successfully.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Failed to Add Employee',
        message: 'Check the details and try again',
        color: 'red',
      });
    }
  },
  fetchEmployee: async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://127.0.0.1:8000/api/employee/employees/', {
        headers: { Authorization: `Token ${token}` },
      });

      set((_) => ({ employees: response.data }));
    } catch (err) {
      notifications.show({
        title: 'Failed to Add Employee',
        message: 'Check the details and try again',
        color: 'red',
      });
    }
  },
  updateEmployee: async (employee) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/employee/employees/${employee.id}/`, employee, {
        headers: { Authorization: `Token ${token}` },
      });
      notifications.show({
        title: 'Employee Updated',
        message: 'The employee has been updated successfully.',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Failed to Update Employee',
        message: 'Check the details and try again',
        color: 'red',
      });
    }
  },

  deleteEmployee: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/employee/employees/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      set((state) => ({ employees: state.employees.filter((em) => em.id !== id) }));
      notifications.show({
        title: 'Employee Deleted',
        message: 'The employee has been deleted successfully.',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Failed to Delete Employee',
        message: 'Please try again',
        color: 'red',
      });
    }
  },
}));

export { useAuthStore, useEmployeeStore };
