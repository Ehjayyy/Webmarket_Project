import { useEffect } from "react";
import { useAdmin } from "../../store/adminStore";
import { useAuth } from "../../store/authStore";
import { useToast } from "../../store/toastStore";

export default function Reports() {
  const { user } = useAuth();
  const { reports, reportsLoading, fetchReports, deleteReport, updateReportStatus } = useAdmin();
  const { showToast } = useToast();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
            <p className="mt-4 text-lg text-gray-600">You do not have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleDeleteReport = async (reportId: number) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(reportId);
        showToast("Report deleted successfully");
      } catch {
        showToast("Failed to delete report");
      }
    }
  };

  const handleUpdateReportStatus = async (reportId: number, status: string) => {
    try {
      await updateReportStatus(reportId, status);
      showToast("Report status updated successfully");
    } catch {
      showToast("Failed to update report status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Reports</h1>
          <p className="mt-2 text-lg text-gray-600">Handle user reports for scams, abuse, and violations</p>
        </div>

        {reportsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading reports...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.user.name}</div>
                        <div className="text-sm text-gray-500">{report.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {report.target_type === "seller" ? "Seller" : "Product"}
                        </div>
                        <div className="text-sm text-gray-500">ID: {report.target_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{report.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          report.status === "PENDING" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : report.status === "IN_PROGRESS" 
                            ? "bg-blue-100 text-blue-800" 
                            : report.status === "RESOLVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <select
                          value={report.status}
                          onChange={(e) => handleUpdateReportStatus(report.id, e.target.value)}
                          className="text-blue-600 hover:text-blue-900 mr-3 bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="DISCARDED">Discarded</option>
                        </select>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!reportsLoading && reports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500">There are no reports to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
