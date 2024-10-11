'use client';


import { DataCharts } from '@/components/data-charts';
import { DataGrid } from '@/components/data-grid';

import Filters from '@/components/filter';


export default function DashboardPage() {

  return (
    <div className="mx-auto  w-full max-w-screen-2xl pb-10">
      <div className=' p-3 flex ml-2 '>
          <Filters/>
 
      </div>
      <div className='mt-4'>
        <DataGrid />
        <DataCharts />
      </div>
    </div>
  );
}