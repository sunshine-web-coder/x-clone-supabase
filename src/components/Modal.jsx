'use client';

import { useRouter } from 'next/navigation';

export default function Modal({ children }) {
  const router = useRouter();

  const closeModal = (e) => {
    e.stopPropagation();
    router.back(); // Go back to the previous page
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={closeModal}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
