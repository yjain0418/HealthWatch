"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MachinesPage() {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");
  const [filterOS, setFilterOS] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("lastSeenDesc");

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
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }

    fetchReports();
  }, []);

  const filteredMachines = useMemo(() => {
    return machines.filter((m) => {
      // Filter by OS
      if (filterOS !== "all" && (m.os_type || m.os || "").toLowerCase() !== filterOS.toLowerCase()) {
        return false;
      }

      // Filter by Status (Healthy or Has Issues)
      const hasIssues = Array.isArray(m.issues) && m.issues.length > 0;
      if (filterStatus === "healthy" && hasIssues) return false;
      if (filterStatus === "issues" && !hasIssues) return false;

      // Search filter on machine_id, os, issues
      const s = search.toLowerCase();
      if (
        !(
          m.machine_id?.toLowerCase().includes(s) ||
          (m.os_type || m.os || "").toLowerCase().includes(s) ||
          (Array.isArray(m.issues) &&
            m.issues.some((issue) => issue.toLowerCase().includes(s)))
        )
      ) {
        return false;
      }

      return true;
    });
  }, [machines, filterOS, filterStatus, search]);

  const sortedMachines = useMemo(() => {
    const sorted = [...filteredMachines];
    switch (sortBy) {
      case "lastSeenAsc":
        sorted.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        break;
      case "lastSeenDesc":
        sorted.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        break;
      case "machineIdAsc":
        sorted.sort((a, b) =>
          a.machine_id.localeCompare(b.machine_id)
        );
        break;
      case "machineIdDesc":
        sorted.sort((a, b) =>
          b.machine_id.localeCompare(a.machine_id)
        );
        break;
      case "issuesAsc":
        sorted.sort(
          (a, b) =>
            (a.issues?.length || 0) - (b.issues?.length || 0)
        );
        break;
      case "issuesDesc":
        sorted.sort(
          (a, b) =>
            (b.issues?.length || 0) - (a.issues?.length || 0)
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredMachines, sortBy]);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Machines Overview</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search by machine ID, OS, or issue..."
          className="flex-grow max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select onValueChange={setFilterOS} value={filterOS}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by OS" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All OS</SelectItem>
              <SelectItem value="windows">Windows</SelectItem>
              <SelectItem value="macos">macOS</SelectItem>
              <SelectItem value="linux">Linux</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={setFilterStatus} value={filterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="issues">Has Issues</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lastSeenDesc">Last Check-in (Newest)</SelectItem>
              <SelectItem value="lastSeenAsc">Last Check-in (Oldest)</SelectItem>
              <SelectItem value="machineIdAsc">Machine ID (A-Z)</SelectItem>
              <SelectItem value="machineIdDesc">Machine ID (Z-A)</SelectItem>
              <SelectItem value="issuesAsc">Number of Issues (Fewest)</SelectItem>
              <SelectItem value="issuesDesc">Number of Issues (Most)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Machine ID</TableHead>
            <TableHead>OS</TableHead>
            <TableHead>Last Check-in</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Issues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMachines.map((m) => {
            const hasIssues = Array.isArray(m.issues) && m.issues.length > 0;
            return (
              <TableRow key={m.machine_id}>
                <TableCell>
                  <a
                    href={`/machine/${m.machine_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {m.machine_id}
                  </a>
                </TableCell>
                <TableCell>{m.os_type || m.os || "Unknown"}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(m.timestamp))} ago
                </TableCell>
                <TableCell>
                  {hasIssues ? (
                    <Badge variant="destructive">Issues</Badge>
                  ) : (
                    <Badge variant="success">Healthy</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {hasIssues
                    ? m.issues.map((issue, idx) => (
                        <Badge
                          key={idx}
                          variant="destructive"
                          className="mr-1 mb-1"
                        >
                          {issue}
                        </Badge>
                      ))
                    : "None"}
                </TableCell>
              </TableRow>
            );
          })}
          {sortedMachines.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                No machines found matching filters/search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
