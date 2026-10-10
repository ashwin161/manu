import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { getUserPetitionsFromFirestore, PetitionDocument } from '@/lib/firebase';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [petitions, setPetitions] = useState<PetitionDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPetition, setSelectedPetition] = useState<PetitionDocument | null>(null);

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    const fetchPetitions = async () => {
      try {
        setLoading(true);
        const data = await getUserPetitionsFromFirestore(user.uid);
        if (mounted) {
          setPetitions(data);
        }
      } catch (err) {
        console.error("Failed to load petitions:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPetitions();
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citizen Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as: <span className="font-medium text-gray-700">{user?.email || user?.displayName}</span>
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
        >
          + Create New Petition
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="mt-6">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-3">Fetching your petitions from Firestore...</p>
          </div>
        ) : petitions.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl p-8">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold">
              ம
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">No petitions found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
              You haven't generated or saved any official petitions yet. Draft your first petition using casual Tanglish.
            </p>
            <div className="mt-6">
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create New Petition
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
              <span>Your Past Petitions ({petitions.length})</span>
              <span>Firestore Collection: petitions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {petitions.map((pet, idx) => (
                <div
                  key={pet.id || idx}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-indigo-50 text-indigo-700">
                        {pet.department || 'General Grievance'}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {pet.tamilOutput?.subject || pet.englishOutput?.subject || 'Government Grievance Petition'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-3 italic bg-gray-50 p-2 rounded border border-gray-100">
                        "{pet.tanglishInput}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-mono">
                      ID: {pet.id?.slice(0, 8)}...
                    </span>
                    <button
                      onClick={() => setSelectedPetition(pet)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      View Draft →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal to view saved petition details */}
      {selectedPetition && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-sm font-bold text-gray-800">
                Saved Petition: {selectedPetition.department}
              </h3>
              <button
                onClick={() => setSelectedPetition(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="bg-amber-50 p-3 rounded border border-amber-200">
                <span className="font-semibold text-amber-900 block">Original Tanglish Input:</span>
                <p className="text-amber-800 mt-1 italic font-sans">{selectedPetition.tanglishInput}</p>
              </div>

              <div className="border border-gray-200 p-4 rounded bg-gray-50">
                <h4 className="font-bold text-indigo-900 text-sm mb-1">
                  {selectedPetition.tamilOutput?.header || 'தமிழ்நாடு அரசு மனு'}
                </h4>
                <p className="font-semibold text-gray-800 mt-2">
                  {selectedPetition.tamilOutput?.subject}
                </p>
                <p className="whitespace-pre-line text-gray-700 mt-2 leading-relaxed">
                  {selectedPetition.tamilOutput?.body}
                </p>
              </div>

              <div className="border border-gray-200 p-4 rounded bg-gray-50">
                <h4 className="font-bold text-indigo-900 text-sm mb-1">
                  {selectedPetition.englishOutput?.header || 'Official Government Petition'}
                </h4>
                <p className="font-semibold text-gray-800 mt-2">
                  {selectedPetition.englishOutput?.subject}
                </p>
                <p className="whitespace-pre-line text-gray-700 mt-2 leading-relaxed">
                  {selectedPetition.englishOutput?.body}
                </p>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-right">
              <button
                onClick={() => setSelectedPetition(null)}
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
