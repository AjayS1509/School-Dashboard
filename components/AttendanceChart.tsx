'use client';
import Image from 'next/image';
import React from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// #region Sample data
const data = [
  {
    name: 'Mon',
    present: 4000,
    absent: 2400,
  },
  {
    name: 'Tue',
    present: 3000,
    absent: 1398,
  },
  {
    name: 'Wed',
    present: 2000,
    absent: 9800,
  },
  {
    name: 'Thrs',
    present: 2780,
    absent: 3908,
  },
  {
    name: 'Fri',
    present: 1890,
    absent: 4800,
  },
];

const AttendanceChart = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src={'/moreDark.png'} alt="" height={20} width={20} />
      </div>

      <ResponsiveContainer height={'90%'} width={'100%'}>
        <BarChart width={500} height={300} barSize={20} responsive data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
          />
          <YAxis
            width="auto"
            axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
          />
          <Bar
            dataKey="present"
            fill="#FAE27C"
            /* activeBar={{ fill: 'pink', stroke: 'blue' }} */
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#C3EBFA"
            /* activeBar={{ fill: 'gold', stroke: 'purple' }} */
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
