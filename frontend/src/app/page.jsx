"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get(`${API_URL}/reports`);
        const data = res.data;

        // Deduplicate by machine_id - keep latest report per machine
        const latestReportsMap = new Map();

        data.forEach((report) => {
          const existing = latestReportsMap.get(report.machine_id);
          if (
            !existing ||
            new Date(report.timestamp) > new Date(existing.timestamp)
          ) {
            latestReportsMap.set(report.machine_id, report);
          }
        });

        const latestReports = Array.from(latestReportsMap.values());
        setMachines(latestReports);
        setFiltered(latestReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }

    fetchReports();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      machines.filter(
        (m) =>
          m.machine_id?.toLowerCase().includes(s) ||
          (m.os_type || m.os || "")
            .toLowerCase()
            .includes(s) ||
          (Array.isArray(m.issues) &&
            m.issues.some((issue) => issue.toLowerCase().includes(s)))
      )
    );
  }, [search, machines]);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">System Monitoring Dashboard</h1>
      <Input
        placeholder="Search by machine ID, OS, or issue..."
        className="mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <Link key={m.machine_id} href={`/machine/${m.machine_id}`}>
            <Card className="shadow-md border cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 space-y-2">
                <div className="text-lg font-semibold">
                  Machine ID: {m.machine_id}
                </div>
                <div className="text-sm">OS: {m.os_type || m.os || "Unknown"}</div>
                <div className="text-sm">
                  Last Seen: {formatDistanceToNow(new Date(m.timestamp))} ago
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(m.issues) && m.issues.length > 0 ? (
                    m.issues.map((issue, idx) => (
                      <Badge key={idx} variant="destructive">
                        {issue}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="default">Healthy</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/machine">
          <Button className="w-full md:w-auto">
            View All Machines
          </Button>
        </Link>
      </div>
    </main>
  );
}