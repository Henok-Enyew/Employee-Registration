import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';

import { useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { MantineReactTable, MRT_ColumnDef, MRT_Row, MRT_TableOptions } from 'mantine-react-table';
import { ActionIcon, Box, Button, Flex, Text, Tooltip } from '@mantine/core';
import { modals, ModalsProvider } from '@mantine/modals';
import { useEmployeeStore } from '@/store/store';

type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  sex: string;
  phone_number: string;
  position: string;
  salary: number;
  hire_date: string;
};

const EmployeeTable = () => {
  const { employees, addEmployee, fetchEmployee, updateEmployee, deleteEmployee } =
    useEmployeeStore();
  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'first_name',
        header: 'First Name',
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
      },

      {
        accessorKey: 'phone_number',
        header: 'Phone Number',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'sex',
        header: 'Sex',
      },

      {
        accessorKey: 'position',
        header: 'Position',
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
      },
    ],
    []
  );

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleCreateEmployee: MRT_TableOptions<Employee>['onCreatingRowSave'] = async ({
    values,
    exitCreatingMode,
  }) => {
    addEmployee(values);
    exitCreatingMode();
  };
  const handleSaveRow: MRT_TableOptions<Employee>['onEditingRowSave'] = async ({
    table,
    values,
  }) => {
    updateEmployee(values);
    table.setEditingRow(null); //exit editing mode
  };

  const openDeleteConfirmModal = (row: MRT_Row<Employee>) =>
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this user?',
      children: (
        <Text>
          Are you sure you want to delete {row.original.first_name} {row.original.last_name}?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteEmployee(row.original.id),
    });

  const handleExportRows = (rows: MRT_Row<Employee>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('Employees.pdf');
  };

  return (
    <ModalsProvider>
      <MantineReactTable
        columns={columns}
        data={employees}
        editDisplayMode="modal"
        createDisplayMode="modal"
        enableColumnOrdering
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            style={{
              display: 'flex',
              gap: '16px',
              padding: '8px',
              flexWrap: 'wrap',
            }}
          >
            <Button
              onClick={() => {
                table.setCreatingRow(true);
              }}
              style={{
                marginRight: '40px',
              }}
              rightSection={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="#fff"
                  viewBox="0 0 256 256"
                >
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z">
                    {' '}
                  </path>
                </svg>
              }
            >
              Create New User
            </Button>
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              //export all rows, including from the next page, (still respects filtering and sorting)
              onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
              leftSection={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#fff"
                  viewBox="0 0 256 256"
                >
                  <path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z">
                    {' '}
                  </path>
                </svg>
              }
              variant="filled"
            >
              Export All Rows
            </Button>
            <Button
              disabled={table.getRowModel().rows.length === 0}
              //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
              onClick={() => handleExportRows(table.getRowModel().rows)}
              leftSection={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#fff"
                  viewBox="0 0 256 256"
                >
                  <path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z">
                    {' '}
                  </path>
                </svg>
              }
              variant="filled"
            >
              Export Page Rows
            </Button>
            {/* <Button
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              //only export selected rows
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              leftSection={<IconDownload />}
              variant="filled"
            >
              Export Selected Rows
            </Button> */}
          </Box>
        )}
        onCreatingRowSave={handleCreateEmployee}
        renderRowActions={({ row, table }) => (
          <Flex gap="md">
            <Tooltip label="Edit">
              <ActionIcon onClick={() => table.setEditingRow(row)}>
                {/* <MdEdit /> */}
                {/* <IconEdit /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#fff"
                  viewBox="0 0 256 256"
                >
                  <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z">
                    {' '}
                  </path>
                </svg>
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
                {/* <IconTrash /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#fff"
                  viewBox="0 0 256 256"
                >
                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z">
                    {' '}
                  </path>
                </svg>
                {/* <FaRegTrashCan /> */}
              </ActionIcon>
            </Tooltip>
          </Flex>
        )}
        enableEditing
        onEditingRowSave={handleSaveRow}
      />
    </ModalsProvider>
  );
};

export default EmployeeTable;
