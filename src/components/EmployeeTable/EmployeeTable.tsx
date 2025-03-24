import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';

import { useMemo, useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { MantineReactTable, MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { ActionIcon, Button, Flex, Tooltip } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

// import { Button, TextInput } from '@mantine/core';
// import { modals } from '@mantine/modals';

type Person = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
};

const data: Person[] = [
  {
    firstName: 'Zachary',
    lastName: 'Davis',
    address: '261 Battle Ford',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    firstName: 'Robert',
    lastName: 'Smith',
    address: '566 Brakus Inlet',
    city: 'Westerville',
    state: 'West Virginia',
  },
  {
    firstName: 'Kevin',
    lastName: 'Yan',
    address: '7777 Kuhic Knoll',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    firstName: 'John',
    lastName: 'Upton',
    address: '722 Emie Stream',
    city: 'Huntington',
    state: 'Washington',
  },
  {
    firstName: 'Nathan',
    lastName: 'Harris',

    address: '1 Kuhic Knoll',
    city: 'Ohiowa',
    state: 'Nebraska',
  },
];

const EmployeeTable = () => {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },

      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },

      {
        accessorKey: 'state',
        header: 'State',
      },
    ],
    []
  );

  const [tableData, setTableData] = useState<Person[]>(() => data);

  const handleSaveRow: MRT_TableOptions<Person>['onEditingRowSave'] = async ({
    table,
    row,
    values,
  }) => {
    tableData[row.index] = values;

    setTableData([...tableData]);
    table.setEditingRow(null); //exit editing mode
  };

  return (
    <ModalsProvider>
      <MantineReactTable
        columns={columns}
        data={tableData}
        editDisplayMode="modal"
        createDisplayMode="modal"
        renderTopToolbarCustomActions={({ table }) => (
          <Button
            onClick={() => {
              table.setCreatingRow(true); //simplest way to open the create row modal with no default values
              //or you can pass in a row object to set default values with the `createRow` helper function
              // table.setCreatingRow(
              //   createRow(table, {
              //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
              //   }),
              // );
            }}
          >
            Create New User
          </Button>
        )}
        renderRowActions={({ row, table }) => (
          <Flex gap="md">
            <Tooltip label="Edit">
              <ActionIcon onClick={() => table.setEditingRow(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon color="red" onClick={() => console.log('row')}>
                <IconTrash />
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
