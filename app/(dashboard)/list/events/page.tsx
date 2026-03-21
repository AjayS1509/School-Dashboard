import FormModel from '@/components/FormModel';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
//import { eventsData, resultsData, role } from '@/lib/data';
import { Class, Event, Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/setting';
import { getRole } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

/* type Event = {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
}; */

type EventList = Event & { class: Class };

const renderRow = (item: EventList, role: string) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight "
  >
    <td className="flex items-center gap-4 p-4">{item.title}</td>
    <td>{item.class?.name || '-'}</td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat('en-Us').format(item.startDate)}
    </td>
    <td className="hidden md:table-cell">
      {item.startDate.toLocaleDateString('en-Us', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}
    </td>
    <td className="hidden md:table-cell">
      {item.endDate.toLocaleDateString('en-Us', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === 'admin' && (
          <>
            <FormModel table="event" type="update" data={item} />
            <FormModel table="event" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);
const EventListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { role, userId } = await getRole();
  const columns = [
    {
      header: 'Title',
      accessor: 'title',
    },
    {
      header: 'Class',
      accessor: 'class',
    },
    {
      header: 'Date',
      accessor: 'date',
      classname: 'hidden lg:table-cell',
    },
    {
      header: 'StartTime',
      accessor: 'startTime',
      classname: 'hidden lg:table-cell',
    },
    {
      header: 'EndTime',
      accessor: 'endTime',
      classname: 'hidden lg:table-cell',
    },
    ...(role === 'admin'
      ? [
          {
            header: 'Actions',
            accessor: 'actions',
          },
        ]
      : []),
  ];
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page as string) : 1;
  //console.log('searchParams =>', p);

  /* URL PARAMS CONDITION */

  const query: Prisma.EventWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = { contains: value as string, mode: 'insensitive' };
            break;
          default:
            break;
        }
      }
    }
  }

  //Role conditions
  /*   switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.OR = [
        { classId: null },
        { class: { lessons: { some: { teacherId: userId! } } } },
      ];
      break;

    default:
      break;
  } */
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { student: { some: { id: userId! } } },
    parent: { student: { some: { parentId: userId! } } },
  };

  query.OR = [
    { classId: null },
    {
      class: roleConditions[role as keyof typeof roleConditions] || {},
    },
  ];

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex  flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src={'/filter.png'} alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src={'/sort.png'} alt="" width={14} height={14} />
            </button>
            {role === 'admin' && <FormModel table="lesson" type="create" />}
          </div>
        </div>
      </div>
      {/* List */}
      <Table
        columns={columns}
        renderRow={(item) => renderRow(item, role)}
        data={data}
      />
      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default EventListPage;
