'use client';

import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb/api';
import { RemarkableStaff } from '@/types/supabase';

interface RemarkableStaffListProps {
  staff: RemarkableStaff[];
}

export default function RemarkableStaffList({ staff }: RemarkableStaffListProps) {
  if (staff.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Aucun membre du staff remarquable.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {staff.map((person) => (
        <div key={person.id} className="flex flex-col items-center">
          <div className="relative h-32 w-32 rounded-full overflow-hidden mb-2">
            <Image
              src={person.photo_url || getImageUrl(null, 'w185')}
              alt={person.nom}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <h4 className="text-center font-medium">{person.nom}</h4>
          <p className="text-center text-sm text-gray-600">{person.role}</p>
        </div>
      ))}
    </div>
  );
}
