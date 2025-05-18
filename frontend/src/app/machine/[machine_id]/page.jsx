"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MachineReportsPage() {
  const { machine_id } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/machine/${machine_id}`);
        // Assuming res.data is an array of reports for this machine
        const sortedReports = res.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setReports(sortedReports);
      } catch (err) {
        setError("Failed to fetch reports. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [machine_id]);

  if (loading)
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Loading reports...</h1>
      </main>
    );

  if (error)
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Error</h1>
        <p className="text-red-600">{error}</p>
      </main>
    );

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reports for Machine: {machine_id}</h1>

      {reports.length === 0 && (
        <p className="text-center text-gray-600">No reports found for this machine.</p>
      )}

      <div className="space-y-6">
        {reports.map((report, idx) => {
          const hasIssues = Array.isArray(report.issues) && report.issues.length > 0;
          return (
            <Card key={idx} className="shadow-md border">
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    Reported at:{" "}
                    <time dateTime={report.timestamp}>
                      {format(new Date(report.timestamp), "PPpp")}
                    </time>
                  </div>
                  <Badge variant={hasIssues ? "destructive" : "success"}>
                    {hasIssues ? "Issues Reported" : "Healthy"}
                  </Badge>
                </div>

                <div>
                  <strong>Operating System:</strong> {report.os_type || report.os || "Unknown"}
                </div>

                <div>
                  <strong>Antivirus Status:</strong>{" "}

                  {report.antivirus_status.AntivirusEnabled ? (
                    <Badge variant="success">{report.antivirus_status.AntivirusEnabled || "Active"}</Badge>
                  ) : (
                    <Badge variant="destructive">Not Present</Badge>
                  )}
                </div>

                <div>
                  <strong>Inactivity Sleep (AC):</strong>{" "}
                  {report.sleep_settings && report.sleep_settings.ac_time ? (
                    (() => {
                      const sleepACMinutes = report.sleep_settings.ac_time / 60;
                      return sleepACMinutes > 0 ? (
                        <Badge variant={sleepACMinutes > 10 ? "destructive" : "success"}>
                          {sleepACMinutes.toFixed(1)} min
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Unknown</Badge>
                      );
                    })()
                  ) : (
                    <Badge variant="secondary">Unknown</Badge>
                  )}
                </div>

                <div>
                  <strong>Inactivity Sleep (DC):</strong>{" "}
                  {report.sleep_settings && report.sleep_settings.dc_time ? (
                    (() => {
                      const sleepDCMinutes = report.sleep_settings.dc_time / 60;
                      return sleepDCMinutes > 0 ? (
                        <Badge variant={sleepDCMinutes > 10 ? "destructive" : "success"}>
                          {sleepDCMinutes.toFixed(1)} min
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Unknown</Badge>
                      );
                    })()
                  ) : (
                    <Badge variant="secondary">Unknown</Badge>
                  )}
                </div>

                <div>
                  <strong>Issues:</strong>{" "}
                  {hasIssues ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {report.issues.map((issue, i) => (
                        <Badge key={i} variant="destructive">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    "None"
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
