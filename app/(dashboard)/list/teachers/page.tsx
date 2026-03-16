import FormModel from '@/components/FormModel';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { role, teachersData } from '@/lib/data';
import { Class, Prisma, Subject, Teacher } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/setting';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const columns = [
  {
    header: 'Info',
    accessor: 'info',
  },
  {
    header: 'TeacherID',
    accessor: 'teacherId',
    classname: 'hidden md:table-cell',
  },
  {
    header: 'Subjects',
    accessor: 'subjects',
    classname: 'hidden md:table-cell',
  },
  {
    header: 'Classes',
    accessor: 'classes',
    classname: 'hidden md:table-cell',
  },
  {
    header: 'Phone',
    accessor: 'phone',
    classname: 'hidden lg:table-cell',
  },
  {
    header: 'Address',
    accessor: 'adddress',
    classname: 'hidden lg:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'actions',
  },
];

const renderRow = (item: TeacherList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight "
  >
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.img || '/noAvatar.png'}
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className=" font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.username}</td>
    <td className="hidden md:table-cell">
      {item.subjects.map((subject) => subject.name).join(',')}
    </td>
    <td className="hidden md:table-cell">
      {item.classes.map((classItem) => classItem.name).join(',')}
    </td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src={'/view.png'} alt="" height={16} width={16} />
          </button>
        </Link>
        {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
              <Image src={'/delete.png'} alt="" height={16} width={16} />
            </button> */}
        {role === 'admin' && (
          <FormModel table="teacher" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page as string) : 1;
  //console.log('searchParams =>', p);

  /* URL PARAMS CONDITION */

  const query: Prisma.TeacherWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            {
              query.lessons = {
                some: {
                  classId: parseInt(queryParams.classId! as string),
                },
              };
            }
            break;
          case 'search':
            query.name = { contains: value as string, mode: 'insensitive' };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({
      where: query,
    }),
  ]);

  //console.log('count', count);
  //console.log('teachers', data);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex  flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src={'/filter.png'} alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src={'/sort.png'} alt="" width={14} height={14} />
            </button>
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src={'/plus.png'} alt="" width={14} height={14} />
              </button> */}
            {role === 'admin' && <FormModel table="teacher" type="create" />}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
