import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { storeService } from "../../services/storeService";
import LoadingSpinner from "../common/LoadingSpinner";
import toast from "react-hot-toast";

const StoresTable = ({ stores, loading, onRefetch }) => {
  const [actionLoading, setActionLoading] = useState(null);

  const handleDelete = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    setActionLoading(storeId);
    try {
      await storeService.deleteStore(storeId);
      toast.success("Store deleted successfully");
      onRefetch(); // 🔄 Refresh stats & list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete store");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Stores</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Owner</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stores?.map((store) => (
              <tr key={store._id}>
                <td className="px-6 py-4">{store.name}</td>
                <td className="px-6 py-4">{store.owner?.name || "N/A"}</td>
                <td className="px-6 py-4">
                  {new Date(store.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(store._id)}
                    disabled={actionLoading === store._id}
                    className="text-red-600 hover:text-red-900"
                  >
                    {actionLoading === store._id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!stores?.length && (
          <div className="text-center py-6 text-gray-500">No stores found</div>
        )}
      </div>
    </div>
  );
};

export default StoresTable;
