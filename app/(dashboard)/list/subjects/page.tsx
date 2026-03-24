import FormModel from '@/components/FormModel';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
//import { role, subjectsData } from '@/lib/data';
import {
  Lesson,
  Prisma,
  Subject,
  Teacher,
} from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/setting';
import { getRole } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

/* type Subject = {
  id: number;
  name: string;
  teachers: string[];
}; */

type SubjectList = Subject & { teachers: Teacher[] };

const renderRow = (item: SubjectList, role: string) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight "
  >
    <td className="flex items-center gap-4 p-4">{item.name}</td>
    <td className="hidden md:table-cell">
      {item.teachers?.map((teacher) => teacher.name).join(', ')}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === 'admin' && (
          <>
            <FormModel table="subject" type="update" data={item} />
            <FormModel table="subject" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);
const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { role, userId } = await getRole();
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page as string) : 1;
  //console.log('searchParams =>', p);
  const columns = [
    {
      header: 'SubjectName',
      accessor: 'name',
    },
    {
      header: 'Teachers',
      accessor: 'teachers',
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

  /* URL PARAMS CONDITION */

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
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
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.subject.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex  flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src={'/filter.png'} alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src={'/sort.png'} alt="" width={14} height={14} />
            </button>
            {role === 'admin' && <FormModel table="subject" type="create" />}
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

export default SubjectListPage;
